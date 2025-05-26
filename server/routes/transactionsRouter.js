const Router = require('express')
const transactionsController = require('../controllers/transactionsController')
const router = new Router()

router.post('/', transactionsController.create)
router.post('/sberbank', transactionsController.createSberbank)
router.get('/', transactionsController.getAll)
router.get('/temp', transactionsController.getAllTemp)
router.get('/:id', transactionsController.getOne)

module.exports = router