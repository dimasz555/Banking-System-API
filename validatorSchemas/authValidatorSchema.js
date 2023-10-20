const {body} = require ('express-validator');

const registerValidator = [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').not().isEmpty().isEmail(),
    body('password').not().isEmpty().withMessage('Password is required')
]

const loginValidator = [
    body('email').not().isEmpty().withMessage('Email is required'),
    body('password').not().isEmpty()
]


module.exports = {
    registerValidator,
    loginValidator
}