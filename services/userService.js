
// const client = require('../redisClient');
// const config = require('../config');
// const md5 = require('md5');


class UsersService {

    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }

    getUsers(req, res) {
        return this.usersRepository.getUsers(req, res);
    }

    postUser(req, res) {
        return this.usersRepository.postUser(req, res)
    }

    getToken(req, res) {
        this.usersRepository.getToken(req, res);
    }
}

module.exports = UsersService;


// function testCaigiDo() {

//     ServiceLocator.isUniTest = true;
//     var usr = new UsersService(ServiceLocator.getService());

//     assert(usr.findAll(), true);
// }



// class UniTestRepository {

//     getUsers(req, res) {

//     }


// }

