const Router = require('express')
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const router = new Router()

const multer = require('multer')
const uuid = require("uuid");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/')
    },
    filename: function (req, file, cb) {
        const type = file.originalname.split('.').at(-1)
        cb(null, uuid.v4() + `.${type}`)
    }
})
const upload = multer({ storage: storage })

router.post('/registration', upload.array('files'), userController.registration)
router.post('/password', userController.password)
router.post('/balance', userController.balance)
router.post('/update/:id', userController.update)
router.post('/users', userController.getAll)
router.get('/drivers', userController.getDrivers)
router.post('/login', userController.login)
router.post('/auth', authMiddleware ,userController.check)
router.post('/:id', userController.getOne)

module.exports = router