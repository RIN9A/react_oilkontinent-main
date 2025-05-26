const {Transaction} = require("../models/models");
const ApiError = require('../error/ApiError')
const sequelize = require('../db')
const {toDBString, getInfoJWT, isAdmin, isManager} = require("../utils/helpers");
const {prepareTransactions} = require("./helpers/transactionsControllerHelper");

class transactionsController {
    async create(req, res, next) {
        const {password, text} = req.body
        if (password !== process.env.APP_PASSWORD)
            return next(ApiError.unauthorized('У вас нет доступа'))

        const values = prepareTransactions(text)

        try{
            const result = await sequelize.query(`
            INSERT INTO transactions
                ( date, card, oil, "oilChanged", cost, "costAZS", value, station, company, "userId", department, "dateAdded" ) 
            VALUES ${values}
            ON CONFLICT ( date, card ) DO NOTHING`)

            return res.json({result})
        }
        catch (err) {
            return res.json({err: err.message})
        }
    }
    async createSberbank(req, res, next) {
        const {password, text} = req.body
        if (password !== process.env.APP_PASSWORD) {
            return next(ApiError.unauthorized('Don\'t understand'))
        }
        const preparedValues = text.split('\n').reduce((acc, transaction) => {
            if (!transaction) return acc + ''

            transaction = transaction.split('|')
            return acc +
                `(${transaction[0] ? toDBString(transaction[0])  : 'null'},` +   // card
                 `${transaction[1] ? toDBString(transaction[1])  : 'null'},` +   // place
                 `${transaction[2] ?            transaction[2]   : 'null'},` +   // value
                 `${transaction[3] ? toDBString(transaction[3])  : 'null'},` +   // date
                 `CURRENT_TIMESTAMP),` ;                                         // dateAdded
        },'').slice(0, -1)

        try{
            const result = await sequelize.query(`
            INSERT INTO "tempTransactions"
                ( card, station, value, date, "dateAdded" )   
            VALUES ${preparedValues}
            ON CONFLICT ( date, card ) DO NOTHING`)

            return res.json({result})
        }
        catch (err) {
            return res.json({err: err.message})
        }
    }
    async getAll(req, res) {
        const {filterDateFrom, filterDateTo, filterSort, filterOil, card, limit=20} = req.query

        const sort = filterSort ? (filterSort == 'По возрастанию' ? 'ASC' : 'DESC') : null
        const oil = filterOil === 'Не выбрано' ? false : filterOil

        const {id} = getInfoJWT(req.headers)

        let where;
        if (isAdmin(req) || isManager(req)) {
            where = `WHERE true
                                ${card && card !== 'all' ? "AND card = '" + card + "'" : ''}
                                ${filterDateFrom ? "AND date > '" + filterDateFrom + "'::date" : ''}
                                ${filterDateTo ? "AND date < '" + filterDateTo + "'::date + interval '1 day'" : ''}
                                ${oil ? "AND \"oilChanged\" = '" + filterOil + "'" : ''} 
                                ${filterSort ? "ORDER BY date " + sort : ''}`
        } else {
            where = `WHERE "userId"= ${id}
                            ${filterDateFrom ? "AND date > '" + filterDateFrom + "'::date" : ''}
                            ${filterDateTo ? "AND date < '" + filterDateTo + "'::date + interval '1 day'" : ''}
                            ${oil ? "AND \"oilChanged\" = '" + filterOil + "'" : ''}
                            ${card ? "AND card = '" + card + "'" : ''}
                            ${filterSort ? "ORDER BY date " + sort : ''}`
        }

        const limitQ = limit ? ` LIMIT ${limit} `: ''

        const [cards] = await sequelize.query(`
            SELECT 
                to_char(date + interval '3 hour', 'YYYY-MM-DD HH24:MI:SS') as date,
                card, oil, "oilChanged", cost, "costAZS", value, station, "userId", department 
            FROM transactions ${where} ${limitQ} 
        `)
        return res.json(cards)
    }
    async getAllTemp(req, res, next) {
        if (!isAdmin(req) && !isManager(req)) return next(ApiError.forbidden('Нет прав'))

        const [tempTransactions] = await sequelize.query(`
            SELECT 
                to_char(date + interval '3 hour', 'YYYY-MM-DD HH24:MI:SS') as date,
                card, station, value, "dateAdded" 
            FROM "tempTransactions"
        `)
        return res.json(tempTransactions)
    }

    async getOne(req, res) {
        const {date} = req.params
        const card = await Transaction.findOne({date})
        return res.json(card)
    }
}

module.exports = new transactionsController()