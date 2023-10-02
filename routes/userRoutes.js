const express = require('express')
const router = express.Router()
const { createUsers } = require('../controllers/userController')

router.post('/',createUsers)

module.exports = router