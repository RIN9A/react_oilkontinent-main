const Router = require('express')
const router = new Router()
const paymentsController = require('../controllers/paymentsController')

router.post('/', paymentsController.create)
router.get('/', paymentsController.getAll)

module.exports = router