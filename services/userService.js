class UserService {

    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    getUserById(id) {
        return this.userRepository.getUserById(id);
    }

    create(user) {
        return this.userRepository.create(user);
    }

}

module.exports = UserService;

