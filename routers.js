const express = require ('express')
const router = express.Router()
const userController = require('./controllers/userController')
const accountController = require('./controllers/accountController')
const transactionController = require('./controllers/transactionController')
const checkToken = require('./middleware/checkToken')

router.get('/',(req,res) => {
    return res.json({
        message: "hello"
    })
})

// Users
router.post('/auth/register', userController.registerUser)
router.post('/auth/login', userController.loginUser)
router.get('/auth/authenticate', checkToken, userController.getProfile)

router.post("/users",userController.registerUser)
router.get("/users",userController.getUser)
router.get("/users/:id",userController.getUserById)

// Accounts
router.post("/accounts",accountController.registAccount)
router.get("/accounts",accountController.getAccounts)
router.get("/accounts/:id",accountController.getAccountById)

// Transactions
router.post("/transactions",transactionController.createTransaction)
router.get("/transactions",transactionController.getAllTransaction)
router.get("/transactions/:id",transactionController.getTransactionById)


module.exports = router