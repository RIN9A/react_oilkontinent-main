const ApiError = require('../error/ApiError')
const { isAdmin, isManager } = require("../utils/helpers");
const sequelize = require("../db");
const { TempTransaction, AZSCost } = require("../models/models");
const { prepareTransactions } = require("./helpers/transactionsControllerHelper");


function getOilType(oilType) {
    if (oilType === 'ДТ') return 'dt'
    if (oilType === 'АИ-92') return 'ai92'
    if (oilType === 'АИ-95') return 'ai95'
    if (oilType === 'СПБТ') return 'spbt'
}

function getOil(oilType) {
    if (oilType === 'dt') return 'ДТ'
    if (oilType === 'ai92 ') return 'АИ-92'
    if (oilType === 'ai95') return 'АИ-95'
    if (oilType === 'spbt ') return 'СПБТ'
}
class AZSController {
    async update(req, res, next) {
        if (!isAdmin(req)) return next(ApiError.forbidden('Нет прав'))

        const { AZSId, bankAddress } = req.body

        const [[azs]] = await sequelize.query(` 
            SELECT * FROM "AZSCosts"  
            WHERE id = ${AZSId};
            
            UPDATE "AZSCosts" 
            SET station = NULL
            WHERE  station = '${bankAddress}';
            
            UPDATE "AZSCosts" 
            SET station = '${bankAddress}'
            WHERE id = ${AZSId};
        `)

        let finished = 0

        const transactions = await TempTransaction.findAll({ where: { station: bankAddress } })
        for (let transaction of transactions) {
            const [[card]] = await sequelize.query(`
                SELECT * FROM cards
                WHERE number = '${transaction.card}'
            `)
            if (!card) return res.json({ message: `Сперва определите кому принадлежит карта ${card}`, finished })

            const { supplier, limits, department, userId } = card
            const oil = limits?.typeOil

            if (oil) {
                const azsCost = azs[oil]
                console.log(azsCost)
                const { date, card, value } = transaction
                if (!azsCost)
                    return res.json({ message: `На выбранной АЗС не указана цена ${getOil(oil)}`, finished })


                const values = prepareTransactions(`${date.toISOString()}|${card}|${oil}|${oil}|${azsCost}|${azsCost}|${value / azsCost}|${bankAddress}|${supplier}|${userId}|${department}`)
                const add = await sequelize.query(`
                    INSERT INTO transactions (date, card, oil, "oilChanged", cost, "costAZS", value, station, company, "userId", department ) 
                    VALUES ${values}
                `)

                console.log(add)

                await sequelize.query(`
                    DELETE FROM "tempTransactions" WHERE date = '${date.toISOString()}'
                `)
                finished++
            }
            else return res.json({ message: `У карты ${card.number} не установлен лимит по видам топлива`, finished })
        }
        return res.json({ message: 'Данные успешно обновлены', finished })
    }


    async updatePrices(req, res, next) {
        if (!isAdmin(req) && !isManager(req)) return next(ApiError.forbidden('Нет прав'));

        try {
            const { AZSId, editedPrices } = req.body;

            if (!AZSId || !editedPrices) {
                return next(ApiError.badRequest('Не указан ID АЗС или новые цены'));
            }

            const azs = await AZSCost.findOne({ where: { id: AZSId } });
            if (!azs) {
                return next(ApiError.notFound('АЗС не найдена'));
            }

            // Подготавливаем объект для обновления
            const updateData = {};
            const currentDate = new Date().toISOString().split('T')[0]; // Получаем текущую дату в формате YYYY-MM-DD

            // Проверяем и обновляем каждое поле цены, если оно было изменено
            if (editedPrices.ai92 !== undefined && editedPrices.ai92 !== azs.ai92) {
                updateData.ai92 = editedPrices.ai92;
                updateData.ai92_date = currentDate;
            }

            if (editedPrices.ai95 !== undefined && editedPrices.ai95 !== azs.ai95) {
                updateData.ai95 = editedPrices.ai95;
                updateData.ai95_date = currentDate;
            }

            if (editedPrices.dt !== undefined && editedPrices.dt !== azs.dt) {
                updateData.dt = editedPrices.dt;
                updateData.dt_date = currentDate;
            }

            if (editedPrices.spbt !== undefined && editedPrices.spbt !== azs.spbt) {
                updateData.spbt = editedPrices.spbt;
                updateData.spbt_date = currentDate;
            }

            // Если нечего обновлять
            if (Object.keys(updateData).length === 0) {
                return res.json({ message: 'Цены не изменились', azs });
            }

            // Обновляем данные в базе
            const [updatedRows] = await AZSCost.update(updateData, {
                where: { id: AZSId },
                returning: true
            });

            if (updatedRows === 0) {
                return next(ApiError.internal('Не удалось обновить цены'));
            }

            // Получаем обновленную запись
            const updatedAZS = await AZSCost.findOne({ where: { id: AZSId } });

            return res.json({ message: 'Цены успешно обновлены', azs: updatedAZS });

        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }




    async getAllRelated(req, res, next) {
        if (!isAdmin(req) && !isManager(req)) return next(ApiError.forbidden('Нет прав'))

        const { inputValue } = req.query

        const [AZS] = await sequelize.query(`
            SELECT * FROM "AZSCosts" 
            WHERE station LIKE '%${inputValue}%'
        `)
        return res.json(AZS)
    }
    async getAll(req, res, next) {
        if (!isAdmin(req)) return next(ApiError.forbidden('Нет прав'))
        const { inputValue } = req.query

        const [AZS] = await sequelize.query(`
            SELECT * FROM "AZSCosts" 
            WHERE LOWER(address) LIKE LOWER('%${inputValue}%')
            LIMIT 15
        `)
        return res.json(AZS)
    }

    async searchAZS(req, res, next) {
        const { inputValue } = req.query;

        // Безопасный поиск по нескольким полям
        const [AZS] = await sequelize.query(`
        SELECT * FROM "AZSCosts" 
        WHERE 
            LOWER(address) LIKE LOWER('%${inputValue}%') OR
            LOWER(station) LIKE LOWER('%${inputValue}%') OR
            LOWER(city) LIKE LOWER('%${inputValue}%') OR
            LOWER(brand) LIKE LOWER('%${inputValue}%')
        ORDER BY station ASC
        LIMIT 15
    `);
        console.log(AZS)

        return res.json(AZS);
    }

    async create(req, res, next) {
        try {
            if (!isAdmin(req)) return ApiError.badRequest('Недостаточно прав');

            const { address, terminals, station, region, city, brand, ai92,
                ai95, dt, spbt
            } = req.body;

            if (!address) {
                return res.status(400).json({ message: 'Адрес АЗС обязателен' });
            }
            if (!station) {
                return res.status(400).json({ message: 'Название станции обязательно' });
            }
            if (!brand) {
                return res.status(400).json({ message: 'Бренд обязателен' });
            }

            const [[existingAzs]] = await sequelize.query(`
            SELECT * FROM "AZSCosts" WHERE "address" = '${address}'
        `);

            if (existingAzs) {
                return res.status(400).json({ message: 'АЗС с таким адресом уже существует' });
            }

            const currentDate = new Date().toISOString().split('T')[0];

            const result = await sequelize.query(` INSERT INTO "AZSCosts" (
                "address", "terminals", "station", "region", "city", "brand",
                "ai92", "ai92_date", "ai95", "ai95_date",
                "dt", "dt_date", "spbt", "spbt_date"
            ) VALUES (
                '${address}',
                ${terminals ? `'${terminals}'` : 'NULL'},
                '${station}',
                ${region ? `'${region}'` : 'NULL'},
                ${city ? `'${city}'` : 'NULL'},
                '${brand}',
                ${ai92 ? ai92 : 'NULL'},
                ${ai92 ? `'${currentDate}'` : 'NULL'},
                ${ai95 ? ai95 : 'NULL'},
                ${ai95 ? `'${currentDate}'` : 'NULL'},
                ${dt ? dt : 'NULL'},
                ${dt ? `'${currentDate}'` : 'NULL'},
                ${spbt ? spbt : 'NULL'},
                ${spbt ? `'${currentDate}'` : 'NULL'}
            ) RETURNING *
        `);
            return res.status(201).json({
                message: 'АЗС успешно создана',
                azs: result[0][0]
            });


        }
        catch (error) {
            console.error('Error in AZS creation:', error);
            return res.status(500).json({ message: 'Ошибка при создании АЗС' });
        }
    }

}

module.exports = new AZSController()