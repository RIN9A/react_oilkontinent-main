const ApiError = require('../error/ApiError')
const { isAdmin, isManager } = require("../utils/helpers");
const sequelize = require("../db");


class UtilsController {
    async getCompanies(req, res) {
        const [companies] = await sequelize.query(`
            SELECT * FROM companies
            `);
        
        return res.json(companies);
    }
    async getDepartments(req, res) {
        const [departments] = await sequelize.query(`
            SELECT * FROM departments
            `);
        
        return res.json(departments);
    }
}

module.exports = new UtilsController();