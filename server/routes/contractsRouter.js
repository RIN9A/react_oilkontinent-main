const Router = require('express')
const contractsController = require('../controllers/contractsController')
const router = new Router()

router.post('/', contractsController.update)
router.get('/', contractsController.getAll)
router.get('/info', contractsController.getOne)

module.exports = router