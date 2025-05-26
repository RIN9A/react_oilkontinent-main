const Router = require('express')
const cardController = require('../controllers/cardsController')
const router = new Router()

router.post('/update', cardController.update)
router.post('/', cardController.create)
router.get('/number', cardController.getNumberCards);
router.get('/', cardController.getAll)
router.get('/:id', cardController.getOne)

module.exports = router