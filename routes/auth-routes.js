const router = require('express').Router();
const passport = require('passport');
const AuthController = require('../controllers/auth-controller');

router.post('/login', AuthController.login);

module.exports = router;