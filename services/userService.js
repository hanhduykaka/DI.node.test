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

    async getAll() {
        return this.userRepository.getAll();
    }

    async delete(id) {
        return this.userRepository.delete(id);
    }

}

module.exports = UserService;

