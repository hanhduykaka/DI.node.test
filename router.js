const express = require('express');
const router = express.Router();
const validator = require('./validator/validator')
const UserController = require('./controller/userController');
const { userService } = require('./serviceLocator');
const config = require('./config');
const userCon = new UserController(userService);

router.post(config.url.users.add, validator.checkUser, (req, res) => userCon.postUser(req, res));
router.get(config.url.users.getAll, (req, res) => userCon.getUsers(req, res));
router.route(config.url.users.byId).get((req, res) => userCon.getUserById(req, res))
    .put(validator.checkUser, (req, res) => userCon.putUser(req, res))
    .delete((req, res) => userCon.deleteUser(req, res));
router.post(config.url.login, validator.checkLogin, (req, res) => userCon.getToken(req, res));

module.exports = router;