const {Tag} = require("../models/models");
const ApiError = require('../error/ApiError')
class tagController {
    async create(req, res, next) {
        try{
            const {userId, name} = req.body
            console.log(req.body)
            if (!userId) next(ApiError.badRequest('Кажется вы не авторизованы'))
            const tag = await Tag.create({name, userId})
            return res.json(tag)
        }
        catch(e) {
            next(ApiError.badRequest('Что-то пошло не так'))
        }
    }
    async getAll(req, res) {
        const tags = await Tag.findAll()
        return res.json(tags)
    }
}

module.exports = new tagController()