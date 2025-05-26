const { Card, User } = require("../models/models");
const { getInfoJWT, isAdmin, isManager } = require("../utils/helpers");
const sequelize = require("../db");
const ApiError = require('../error/ApiError');

class noteController {
  async update(req, res) {
    try {
      const { limitType, typeOil, limitDay,
        limitMonth, cardNumber, holder,
        validUntil } = req.body;
      let { id } = getInfoJWT(req.headers);

      if (!cardNumber) {
        return res.status(400).json({ message: 'Номер карты обязателен' });
      }

      const limits = {
        type: limitType,
        typeOil,
        limitDay,
        limitMonth,
        validUntil,
      };

      const result = await sequelize.query(`
        UPDATE "cards" 
        SET "limits"='${JSON.stringify(limits)}',
            "limitsChanged" = NOW(),
            "holder"='${holder}'
        WHERE 
          ${!isAdmin(req) ? `"userId" = ${id} AND` : ""}
          "number" = '${cardNumber}'
      `);

      return res.json(result);
    } catch (error) {
      console.error('Error in update:', error);
      return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  }

  async create(req, res, next) {
    try {
      const { userId, number, shadowNumber, pin,
        holder, supplier } = req.body;



      if (!number) {
        return res.status(400).json({ message: 'Номер карты обязателен' });
      }


      // Проверка, что карта с таким номером уже не существует
      const [[existingCard]] = await sequelize.query(`
            SELECT * FROM "cards" WHERE "number" = '${number}'
        `);

      if (existingCard) {
        return res.status(400).json({ message: 'Карта с таким номером уже существует' });
      }

      const [[{ companyId, departmentId }]] = await sequelize.query(`
          SELECT "companyId", "departmentId" FROM drivers WHERE "userId" = ${userId}`);

      const now = new Date();
      const validUntil = new Date(new Date(now).setMonth(now.getMonth() + 3)).toISOString();

      const limits = {
        validUntil
      }

      // Создание новой карты
      const result = await sequelize.query(`
            INSERT INTO "cards"( "number", "shadowNumber", "pin", "userId", "holder", "supplier",  "department", limits) 
            VALUES (
                '${number}',
                ${shadowNumber ? `'${shadowNumber}'` : 'NULL'},
                ${pin ? `'${pin}'` : 'NULL'},
                ${userId},
                ${holder ? `'${holder}'` : 'NULL'},
                ${supplier ? `'${supplier}'` : 'NULL'},
                ${departmentId ? `'${departmentId}'` : 'NULL'},
                '${JSON.stringify(limits)}'

            ) RETURNING *
        `);

      return res.status(201).json({
        message: 'Карта успешно создана',
        card: result[0][0]
      });
    } catch (error) {
      console.error('Error in card creation:', error);
      return res.status(500).json({ message: 'Ошибка при создании карты' });
    }
  }

  async getAll(req, res) {
    try {
      const { userId, like } = req.query;
      const decoded = getInfoJWT(req.headers);

      if (!decoded?.id) {
        return res.status(401).json({ message: 'Не авторизован' });
      }

      let cards;

      if (isAdmin(req) || isManager(req)) {
        let query;
        if (userId === 'all' || userId === undefined) {
          query = `
          SELECT  c.*, u.email AS user_email,
          COALESCE(u.name, u.email) AS user_name
          FROM cards c
          LEFT JOIN users u ON c."userId" = u.id
        `;
        }
        else {
          query = `
          SELECT c.*, u.email AS user_email,
          COALESCE(u.name, u.email) AS user_name
          FROM cards c LEFT JOIN users u ON c."userId" = u.id
          WHERE u.id = ${userId}
        `;
        }
        if (like) {
          query += `
            WHERE c.number LIKE '%${like}%' 
            OR c.holder LIKE '%${like}%' 
            OR u.email LIKE '%${like}%'
            OR u.name LIKE '%${like}%'
          `;
        }
        query += ' ORDER BY u."name", c."entered"';
        const [allCards] = await sequelize.query(query);
        cards = allCards;
      } else {
        if (userId && userId !== decoded.id.toString()) {
          return res.status(403).json({ message: 'Нет доступа к картам другого пользователя' });
        }
        cards = await Card.findAll({
          where: { userId: decoded.id },
          order: [['entered', 'ASC']],
          raw: true,
        });
      }
      return res.json(cards);
    } catch (error) {
      console.error('Error in getAll:', error);
      return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  }

  async getOne(req, res) {
    try {
      const decoded = getInfoJWT(req.headers);
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: 'ID карты обязателен' });
      }

      let card;
      if (isAdmin(req) || isManager(req)) {
        // Админ может просматривать любую карту
        const [[cardData]] = await sequelize.query(`
          SELECT 
          c.*, 
            u.email AS user_email,
          COALESCE(u.name, u.email) AS user_name
        FROM cards c
        LEFT JOIN users u ON c."userId" = u.id
            WHERE c.number = '${id}'
        `);
        card = cardData;
      } else {
        // Обычный пользователь может просматривать только свои карты
        card = await Card.findOne({
          where: { number: id, userId: decoded.id },
          raw: true,
        });
      }

      if (!card) {
        return res.status(404).json({ message: 'Карта не найдена' });
      }

      return res.json(card);
    } catch (error) {
      console.error('Error in getOne:', error);
      return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  }


  async getNumberCards(req, res) {
    const [[{ countCards }, { countDrivers }]] = await sequelize.query(`
                SELECT COUNT("number") "countCards" from "cards";
                SELECT COUNT(id) "countDrivers" from users WHERE "permissions" ->> 'role'='driver';
            `);

    return res.json({
      countCards,
      countDrivers,
    })

  }
}

module.exports = new noteController();
