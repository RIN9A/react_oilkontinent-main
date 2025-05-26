const { Transaction, Contract } = require("../models/models");
// const ApiError = require('../error/ApiError')
const sequelize = require('../db')
const { getInfoJWT } = require("../utils/helpers");
const { Op } = require("sequelize");

class contactsController {
    async update(req, res, next) {
        return res.json({ message: "under development" })
        // const {password, text} = req.query
        // if (password !== process.env.APP_PASSWORD) {
        //     return next(ApiError.unauthorized('Don\'t understand'))
        // }
        // const preparedValues = text.split('\n').reduce((acc, transaction) => {
        //     transaction = transaction.split('|')
        //     return acc +
        //         `(${transaction[0] ? toDBString(transaction[0])  : 'null'},` +   // date
        //         `${transaction[1] ? toDBString(transaction[1])  : 'null'},` +   // card
        //         `${transaction[2] ? toDBString(transaction[2])  : 'null'},` +   // oil
        //         `${transaction[3] ? toDBString(transaction[3])  : 'null'},` +   // oil changed
        //         `${transaction[4] ? transaction[4]              : 'null'},` +   // cost
        //         `${transaction[5] ? transaction[5]              : 'null'},` +   // cost AZS
        //         `${transaction[6] ? transaction[6]              : 'null'},` +   // value
        //         `${transaction[7] ? toDBString(transaction[7])  : 'null'},` +   // station
        //         `${transaction[8] ? toDBString(transaction[8])  : 'null'},` +   // company
        //         `${transaction[9] ?  transaction[9]             : 'null'},` +   // supplier
        //         `${transaction[10] ? transaction[10]            : 'null'},` +   // department
        //         `CURRENT_TIMESTAMP),` ;                                         // dateAdded
        // },'').slice(0, -1)
        //
        // try{
        //     const result = await sequelize.query(`
        //     INSERT INTO transactions
        //         ( date, card, oil, "oilChanged", cost, "costAZS", value, station, company, "userId", department, "dateAdded" )
        //     VALUES ${preparedValues}
        //     ON CONFLICT ( date, card ) DO NOTHING`)
        //
        //     return res.json({result})
        // }
        // catch (err) {
        //     return res.json({err: err.message})
        // }
    }

    async getAll(req, res) {
        const { password } = req.body
        if (password !== process.env.APP_PASSWORD) return res.json({ err: 'bad things make world worse' })
        const contracts = await Contract.findAll()
        return res.json(contracts)
    }

    async getOne(req, res) {
        try {
            const { id } = getInfoJWT(req.headers)
            if (!id) {
                return res.status(401).json({ message: 'Unauthorized' })
            }

            const contracts = await Contract.findAll({
                where: {
                    userId: {
                        [Op.in]: [1, id]
                    }
                }
            })

            if (!contracts || contracts.length === 0) {
                return res.json([]);
            }

            return res.json(contracts)
        } catch (error) {
            console.error('Error in getOne:', error)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }
}

module.exports = new contactsController()
