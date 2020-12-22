const express = require('express');
const router = express.Router();
const validator = require('./validator')
const UserController = require('./controller/userController');
const config = require('./config');
const UserRepository = require('./repository/userRepository');
const UserService = require('./services/userService');

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post(config.url.users.add, validator.checkUser, userController.postUser);
// router.get(config.url.users.getAll, user.getUsers);
router.route(config.url.users.byId).get(userController.getUserById);
// .put(validator.checkUser, user.putUser).delete(user.deleteUser);
// router.post(config.url.login, validator.checkLogin, user.getToken);

module.exports = router;