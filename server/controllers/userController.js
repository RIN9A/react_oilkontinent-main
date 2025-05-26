const ApiError = require("../error/ApiError");
const { User, Contract } = require("../models/models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isAdmin, getInfoJWT, isManager } = require("../utils/helpers");
const sequelize = require("../db");

function getOilType(oilType) {
   if (oilType === 'dt') return 'ДТ'
   if (oilType === 'ai92') return 'АИ-92'
   if (oilType === 'ai95') return 'АИ-95'
   if (oilType === 'spbt') return 'СПБТ'
}

const generateJWT = (id, email, permissions, name) => {
   return jwt.sign(
      { id, email, permissions, name },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
   )
}

class UserController {
   async registration(req, res, next) {
      try {
         if (!isAdmin(req) & !isManager(req)) return ApiError.badRequest('Недостаточно прав')
         const { id } = getInfoJWT(req.headers);
         let cards = [];
         if (typeof req.body.cards === 'string') {
            try {
               cards = JSON.parse(req.body.cards);
            } catch (e) {
               console.error('Error parsing cards:', e);
            }
         } else if (Array.isArray(req.body.cards)) {
            cards = req.body.cards;
         }
         const { email, name, contract, cost, discount, INN,
            phoneNumber, role, ai92, ai95, dt, spbt,
            companyId,
            departmentId,
            company,
            department,
            newCompany, newDepartment,
            ...otherData
         } = req.body;

         let companyIdToUse = company;

   


         if (company === 'new' && newCompany) {
            const [[comp]] = await sequelize.query(`
                    SELECT * FROM companies WHERE LOWER(name) = LOWER('${newCompany}')
                `);
            if(!comp) {
            const [newCompanyResult] = await sequelize.query(`
        INSERT INTO companies ("name") VALUES ('${newCompany}') RETURNING id
      `);
            companyIdToUse = newCompanyResult[0].id;
            } else {
               companyIdToUse = comp.id;
            }
            
         }
         console.log(companyIdToUse)
         let departmentIdToUse = department;
         if (department === 'new' && newDepartment && companyIdToUse) {
            const [newDeptResult] = await sequelize.query(`
        INSERT INTO departments ("name", companyid) 
        VALUES ('${newDepartment}', ${companyIdToUse}) RETURNING id
      `);
            departmentIdToUse = newDeptResult[0].id;
         }

         const oilOptions = { ai92, ai95, dt, spbt };
         const typeOil =
            Object.keys(oilOptions)
               .filter(type => oilOptions[type] && oilOptions[type] !== '0');

         const oilTypes = Object.fromEntries(
            Object.keys(oilOptions)
               .filter(type => oilOptions[type] && oilOptions[type] !== '0')
               .map(type => [type, oilOptions[type]])
         );

         const hashPassword = await bcrypt.hash('123', 5);

         const haveUser = await User.findOne({ where: { email } });

         if (!email) return next(ApiError.badRequest('Некорректный email'));
         if (haveUser) return next(ApiError.badRequest('Пользователь с таким email уже существует'));

         const user = await User.create({
            email,
            password: hashPassword,
            name,
            inn: INN,
            phoneNumber,
            permissions: {
               role
            }
         });
         let warningText = '';

         console.log("UUUUUUUser")
         const now = new Date();
         const validUntil = new Date(new Date(now).setMonth(now.getMonth() + 6)).toISOString();

         if (role === "driver") {
            const cardNumbers = cards.map(card => card.number?.replaceAll?.(' ', '') || '');

      

            // Создаем контракт
            const newContract = await Contract.create({
               userId: user.id,
               costs: { ...oilTypes, discount },
               cards: cardNumbers,
               amount: cost,
               department: departmentIdToUse,
               name: contract,
               dateEnd: validUntil,
            });

            await sequelize.query(`
                  INSERT INTO "drivers"("name", "userId", "companyId", "departmentId")
                  VALUES (
                  '${name}', ${user.id}, ${companyIdToUse}, ${departmentIdToUse}
                  )
                  `)
         }
         for (let card of cards) {
            const cardNumber = card.number?.replaceAll?.(' ', '') || '';
            if (!cardNumber) continue;

            const [[cardInfo]] = await sequelize.query(`
                    SELECT * FROM cards WHERE number = '${cardNumber}'
                `);

            if (cardInfo) {
               const [[userInfo]] = await sequelize.query(`
                        SELECT * FROM users WHERE "id" = ${cardInfo.userId}
                    `);
               warningText += `\nКарта ${cardNumber} принадлежала ` + (userInfo.name || userInfo.email);
            }

            const limits = {
               typeOil: typeOil,
               validUntil,
            }

            console.log(limits)

            await sequelize.query(`
                    INSERT INTO cards (
                        number, 
                        "shadowNumber", 
                        pin, 
                        "userId", 
                        holder, 
                        supplier,
                        limits,
                        department
                    ) 
                    VALUES (
                        '${cardNumber}', 
                        ${card.shadowNumber ? `'${card.shadowNumber}'` : 'NULL'}, 
                        ${card.pin ? `'${card.pin}'` : 'NULL'}, 
                        ${user.id}, 
                        ${card.holder ? `'${card.holder}'` : 'NULL'}, 
                        ${card.supplier ? `'${card.supplier}'` : 'NULL'},
                        ${typeOil ? `'${JSON.stringify(limits)}'` : 'NULL'},
                        ${departmentIdToUse ? `'${departmentIdToUse}'` : 'NULL'}
                    ) `);

         }


         return res.json({
            message: 'Пользователь успешно создан!' + warningText,
            userId: user.id
         });
      } catch (e) {
         console.warn(e.message)
         next(ApiError.badRequest(e.message))
      }
   }

   async password(req, res, next) {
      try {
         const { password } = req.body
         const { id } = getInfoJWT(req.headers)

         if (password.length < 5)
            return next(ApiError.badRequest('не менее 5 символов'))

         const hashPassword = await bcrypt.hash(password, 5)
         await User.update({ password: hashPassword }, { where: { id: id } })

         return res.json({ message: 'Успешно обновлён!' })
      } catch (e) {
         next(ApiError.badRequest(e.message))
      }
   }

   async login(req, res, next) {
      const { email, password } = req.body
      const user = await User.findOne({ where: { email } })
      console.log(user)
      if (!user)
         return next(ApiError.unauthorized('Пользователь не найден'))
      if (!password)
         return next(ApiError.unauthorized('Не указан пароль!'))

      let comparePassword = bcrypt.compareSync(password, user.password)
      if (!comparePassword)
         return next(ApiError.unauthorized('Введён не верный пароль'))
      const token = generateJWT(user.id, user.email, user.permissions, user.name)
      return res.json({ token })
   }

   async check(req, res) {
      const token = generateJWT(req.user.id, req.user.email, req.user.permissions, req.user.name)
      return res.json({ token })
   }

   async getDrivers(req, res) {
      if (!isManager(req) && !isAdmin(req)) return ApiError.badRequest('Недостаточно прав')

      const [users] = await sequelize.query(`
            SELECT users.id, users.name, users.inn, users."phoneNumber", users.email, users.password, users.permissions,
         drivers.id AS "driverId", drivers."companyId", 
         companies.name AS "companyName", drivers."departmentId",
         departments.name AS "departmentName"
         FROM users
         LEFT JOIN drivers ON drivers."userId" = users.id LEFT JOIN companies ON companies.id = drivers."companyId"
         LEFT JOIN departments ON departments.id = drivers."departmentId"
         ORDER BY users.name;
        `);

      //   console.log(users);
      const drivers = users.filter(u => u.permissions.role === 'driver');

      return (res.json(drivers))


   }

   async getAll(req, res) {
      if (!isAdmin(req)) return ApiError.badRequest('Недостаточно прав');

      const [users] = await sequelize.query(`
         SELECT users.id, users.name, users.inn, users."phoneNumber", users.email, users.password, users.permissions,
         drivers.id AS "driverId", drivers."companyId", 
         companies.name AS "companyName", drivers."departmentId",
         departments.name AS "departmentName"
         FROM users
         LEFT JOIN drivers ON drivers."userId" = users.id LEFT JOIN companies ON companies.id = drivers."companyId"
         LEFT JOIN departments ON departments.id = drivers."departmentId"
         ORDER BY users.name;
        `)
      return (res.json(users))
   }

   async getOne(req, res) {
      try {
         if (!isAdmin(req) && !isManager(req)) {
            return res.status(403).json({ message: 'Недостаточно прав' });
         }

         const { id } = req.params;
         if (!id) {
            return res.status(400).json({ message: 'ID пользователя не указан' });
         }
         const [[user]] = await sequelize.query(`
      SELECT 
        users.id, users.name, users.inn, users."phoneNumber", users.email, users.password, users.permissions,
        drivers.id AS "driverId", drivers."companyId", companies.name AS "companyName",
        drivers."departmentId", departments.name AS "departmentName"
      FROM users
      LEFT JOIN drivers ON drivers."userId" = users.id
      LEFT JOIN companies ON companies.id = drivers."companyId"
      LEFT JOIN departments ON departments.id = drivers."departmentId"
      WHERE users.id = ${id}
    `);

         if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
         }

         // Контракты отдельным запросом
         const [[contracts]] = await sequelize.query(`
      SELECT 
        json_agg(jsonb_build_object(
          'id', id,
          'name', name,
          'costs', costs,
          'amount', amount
        )) AS contracts
      FROM contracts
      WHERE "userId" = ${id}
    `);

         const contractsArr = contracts.contracts || [];

         // Расчет баланса и статистики
         const [[{ payments = 0 }]] = await sequelize.query(`
  SELECT COALESCE(SUM(value), 0) as payments 
  FROM payments 
  WHERE "userId" = ${id}
`);

         // Баланс: расходы
         const [[{ expenses = 0 }]] = await sequelize.query(`
  SELECT COALESCE(SUM(
    ROUND(
      CAST(
        (ROUND(CAST((cost - cost * COALESCE(${contractsArr[0]?.costs?.discount || '0'}, '0')::numeric / 100) as numeric), 2) * value
      ) as numeric
    ), 2)
  ), 0) as expenses
  FROM transactions
  WHERE "userId" = ${id}
`);

         // Статистика
         const [[{ countCards = 0, countDrivers = 0 }]] = await sequelize.query(`
  SELECT 
    COUNT(*) as "countCards", 
    COUNT("userId") as "countDrivers" 
  FROM cards 
  WHERE "userId" = ${id}
`);

         // Добавляем баланс к первому контракту
         if (contractsArr[0]) {
            contractsArr[0].balance = [payments, expenses];
         }

         // Ответ
         return res.json([user, contractsArr]);
      } catch (error) {
         console.error('Error in getOne:', error);
         return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
      }
   }

   async update(req, res) {
      if (!isAdmin(req)) return ApiError.badRequest('Недостаточно прав')
      const { id } = req.params
      const { fields } = req.body

      for (let key of Object.keys(fields)) {
         const [table, field] = key.split('_')
         const value = fields[key]

         await sequelize.query(`UPDATE "${table}" SET "${field}" = '${value}' WHERE users.id = ${id}`)
      }

      return (res.json(req.body))
   }

   async balance(req, res) {
      const { id } = getInfoJWT(req.headers)


      const { costs: { discount = 0 }, amount } = await Contract.findOne({ where: { userId: id } }) || []

      const [[{ payments }, { expenses }, { countCards, countDrivers }]] = await sequelize.query(`
            SELECT SUM(value) payments 
            FROM payments WHERE "userId" = ${id};
            
            SELECT SUM(ROUND(CAST((ROUND(CAST((cost - cost * ${discount} / 100) as numeric), 2) * value) as numeric), 2)) expenses
            FROM transactions
            WHERE "userId" = ${id};
            
            SELECT COUNT(*) "countCards", COUNT("userId") "countDrivers" from cards where "userId" = ${id}
        `)

      return res.json({
         balance: payments - expenses,
         amount,
         countCards,
         countDrivers,
      })
   }
}

module.exports = new UserController()