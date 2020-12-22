class UserService {

    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }

    getUserById(id) {
        return this.usersRepository.getUserById(id);
    }

    create(user) {
        return this.usersRepository.create(user);
    }

}

module.exports = UserService;

