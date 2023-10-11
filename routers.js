const express = require ('express')
const router = express.Router()
const userController = require('./controllers/userController')
const accountController = require('./controllers/accountController')
const transactionController = require('./controllers/transactionController')

router.get('/',(req,res) => {
    return res.json({
        message: "hello"
    })
})


router.post("/users",userController.registerUser)
router.get("/users",userController.getUser)
router.get("/users/:id",userController.getUserById)
router.post("/accounts",accountController.registAccount)
router.get("/accounts",accountController.getAccounts)
router.get("/accounts/:id",accountController.getAccountById)
router.post("/transactions",transactionController.createTransaction)
router.get("/transactions",transactionController.getAllTransaction)
router.get("/transactions/:id",transactionController.getTransactionById)




module.exports = router