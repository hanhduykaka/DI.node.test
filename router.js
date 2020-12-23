const express = require('express');
const router = express.Router();
const validator = require('./validator')
const userController  = require('./controller/userController');
const config = require('./config');

router.post(config.url.users.add, validator.checkUser, userController.postUser);
router.get(config.url.users.getAll, userController.getUsers);
router.route(config.url.users.byId).get( userController.getUserById)
    .put(validator.checkUser, userController.putUser)
    .delete(userController.deleteUser);
router.post(config.url.login, validator.checkLogin, userController.getToken);

module.exports = router;