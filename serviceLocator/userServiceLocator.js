
const UserRepository = require('../repository/userRepository');
const UnitTestRepository = require('../repository/unitTestRepository');


class UserServiceLocator {

    static getService() {

        if (true)
            return new UnitTestRepository();
        else
            return new UserRepository();
    }

}

module.exports = UserServiceLocator;

