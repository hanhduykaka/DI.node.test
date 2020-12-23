const UserRepository = require('./repository/userRepository');
const UserService = require('./services/userService');

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
module.exports = {
  userRepository,
  userService
};