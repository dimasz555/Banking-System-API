const express = require ('express'),
    router = express.Router(),
    userController = require('./controllers/userController'),
    accountController = require('./controllers/accountController'),
    transactionController = require('./controllers/transactionController'),
    checkToken = require('./middleware/checkToken'),
    validate = require('./middleware/validate'),
    schema = require ('./validatorSchemas/authValidatorSchema')

router.get('/',(req,res) => {
    return res.json({
        message: "hello"
    })
})

// Users
router.post('/auth/register',validate(schema.registerValidator),userController.registerUser)
router.post('/auth/login',validate(schema.loginValidator), userController.loginUser)
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