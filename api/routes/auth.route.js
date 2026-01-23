const express = require('express');
const { signUp, signIn, refreshAccessToken } = require('../controllers/auth.controller')
const router = express.Router()

router.post('/sign-up', signUp)
router.post('/sign-in', signIn)
router.post('/refresh-token',refreshAccessToken);

module.exports = router
