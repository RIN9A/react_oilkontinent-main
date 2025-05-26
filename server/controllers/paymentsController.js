const {Payment} = require("../models/models");
const ApiError = require('../error/ApiError')
const {getInfoJWT} = require("../utils/helpers");
const sequelize = require('../db')

class paymentController {
    async create(req, res, next) {
        return 'created'
    }

    async getAll(req, res) {
        const decoded = getInfoJWT(req.headers)

        const payments = await Payment.findAll({
            where: {userId: decoded.id},
            order: [['date', 'DESC']],
            raw: true
        })
        return res.json(payments)
    }
}

module.exports = new paymentController()