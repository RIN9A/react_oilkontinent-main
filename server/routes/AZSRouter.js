const Router = require('express')
const AZSController = require('../controllers/AZSController')
const router = new Router()

router.post('/', AZSController.update)
router.post('/new', AZSController.create);
router.get('/related', AZSController.getAllRelated)
router.get('/search', AZSController.searchAZS)
router.get('/', AZSController.getAll)
router.put('/', AZSController.updatePrices);
module.exports = router