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
    stubValue[config.users.age] = faker.helpers.createCard();
    stubValue[config.users.password] = md5(faker.helpers.createCard());

    describe("create", function () {
        it("should add a new user to the db", async function () {
            const stub = sinon.stub(userModel, "create").returns(stubValue);
            const userRepository = new UserRepository();
            const user = userRepository.create(stubValue);
            expect(stub.calledOnce).to.be.true;
            expect(user[config.users.id]).to.equal(stubValue[config.users.id]);
            expect(user[config.users.first_name]).to.equal(stubValue[config.users.first_name]);
            expect(user[config.users.last_name]).to.equal(stubValue[config.users.last_name]);
            expect(user[config.users.age]).to.equal(stubValue[config.users.age]);
            expect(user[config.users.password]).to.equal(stubValue[config.users.password]);
            expect(user[config.users.email]).to.equal(stubValue[config.users.email]);
        });
    });

    describe("getUserById", function () {
        it("should retrieve a user with specific id", async function () {
            const stub = sinon.stub(userModel, "findOne").returns(stubValue);
            const userRepository = new UserRepository();
            const user = userRepository.getUserById(stubValue[config.users.id]);
            expect(stub.calledOnce).to.be.true;
            expect(user[config.users.id]).to.equal(stubValue[config.users.id]);
            expect(user[config.users.first_name]).to.equal(stubValue[config.users.first_name]);
            expect(user[config.users.last_name]).to.equal(stubValue[config.users.last_name]);
            expect(user[config.users.age]).to.equal(stubValue[config.users.age]);
            expect(user[config.users.password]).to.equal(stubValue[config.users.password]);
            expect(user[config.users.email]).to.equal(stubValue[config.users.email]);
        });
    });
});