const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const cardRouter = require('./cardsRouter')
const tagRouter = require('./tagRouter')
const filesRouter = require('./filesRouter')
const utilRouter = require('./utilRouter');
const AZSRouter = require('./AZSRouter')
const transactionsRouter = require('./transactionsRouter')
const contractsRouter = require('./contractsRouter')
const paymentsRouter = require('./paymentsRouter')

router.use('/transactions', transactionsRouter)
router.use('/contracts', contractsRouter)
router.use('/payments', paymentsRouter)
router.use('/file', filesRouter)
router.use('/cards', cardRouter)
router.use('/user', userRouter)
router.use('/azs', AZSRouter)
router.use('/tag', tagRouter)
router.use('/utils', utilRouter);

module.exports = router