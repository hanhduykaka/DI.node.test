class UserService {

    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async getUserById(id) {
        return this.userRepository.getUserById(id);
    }

    async create(data) {
        return this.userRepository.create(data);
    }

}

module.exports = UserService;

