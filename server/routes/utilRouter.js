const Router = require('express');
const utilsController = require('../controllers/utilsController');
const router = new Router();

router.get('/companies', utilsController.getCompanies);
router.get('/departments', utilsController.getDepartments);

module.exports = router