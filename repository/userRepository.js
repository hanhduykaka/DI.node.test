const userModel = require("../models/userModels");
class UserRepository {

    async create(userRequest) {
        return userModel.create(userRequest);
    }

    async getUserById(id) {
        return userModel.findOne(id);

    }

    async getAll() {
        return userModel.getAll();
    }

    async delete(id) {
        return userModel.deleteOne(id);
    }

}

module.exports = UserRepository;
