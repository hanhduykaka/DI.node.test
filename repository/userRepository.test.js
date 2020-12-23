const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const faker = require("faker");
const md5 = require('md5');
const userModel = require("../models/userModels");
const UserRepository = require("./userRepository");
const config = require("../config");

describe("UserRepository", function () {
    const stubValue = {};
    stubValue[config.users.id] = faker.random.uuid();
    stubValue[config.users.first_name] = faker.name.findName();
    stubValue[config.users.last_name] = faker.name.findName();
    stubValue[config.users.email] = faker.internet.email();
    stubValue[config.users.age] = 16
    stubValue[config.users.password] = md5('12345678');

    describe("create", function () {
        it("should add a new user to the db", async function () {
            const stub = sinon.stub(userModel, "create").returns(stubValue);
            const userRepository = new UserRepository();
            const user = await userRepository.create(stubValue);
            expect(stub.calledOnce).to.be.true;
            // expect(stub.calledOnce).to.be.true;
        });
    });

    describe("getUserById", function () {
        it("should retrieve a user with specific id", async function () {
            const stub = sinon.stub(userModel, "findOne").returns(stubValue);
            const userRepository = new UserRepository();
            const user = await userRepository.getUserById(stubValue[config.users.id]);
            expect(stub.calledOnce).to.be.true;
        });
    });
});