const express = require('express')
const router = express.Router()
const { LoginUser } = require('../controllers/userController')

router.post('/',LoginUser)

module.exports = router  