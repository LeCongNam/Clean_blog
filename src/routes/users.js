var express = require('express');
var router = express.Router();
const usersController = require('../controller/usersController')



// [GET] /register
router.get('/register', usersController.pageRegister);

// [POST] /register
router.post('/register', usersController.register);

// [GET] /login
router.get('/login', usersController.homeLogin);

// [POST] /login
router.post('/login', usersController.login);

// [GET] /login
router.get('/logout', usersController.homeLogin);

module.exports = router;
