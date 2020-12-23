
const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const faker = require("faker");
const md5 = require('md5');
const config = require("../config");
const UserController = require('./userController');
const UserService = require('../services/userService');
const UserRepository = require('../repository/userRepository');



describe("UserController", function () {
    describe("postUser", function () {
        let status, json, res, userService, userController
        beforeEach(() => {
            status = sinon.stub();
            json = sinon.spy();
            res = { json, status };
            status.returns(res);
            const userRepo = sinon.spy();
            userService = new UserService(userRepo);
        });

        it("should not postUser a user when id already used", async function () {

            const stubValue = {};
            stubValue[config.users.id] = faker.random.uuid();
            stubValue[config.users.first_name] = faker.name.findName();
            stubValue[config.users.last_name] = faker.name.findName();
            stubValue[config.users.email] = faker.internet.email();
            stubValue[config.users.age] = 16
            stubValue[config.users.password] = md5('12345678');
            const req = { body: stubValue };
            const stub = sinon.stub(userService, "getUserById").returns(stubValue);
            userController = new UserController(userService);
            await userController.postUser(req, res);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(400);
            expect(json.calledOnce).to.be.true;
            expect(stub.calledOnce).to.be.true;
            expect(json.args[0][0].msg)
                .to.equal(`${config.msg.badRequest} ${config.msg.users.userWithId} ${stubValue[config.users.id]} ${config.msg.users.alreadyUse}`);
        });
        it("should register a user when all field params are provided", async function () {
            const requestValue = {};
            requestValue[config.users.id] = faker.random.uuid();
            requestValue[config.users.first_name] = faker.name.findName();
            requestValue[config.users.last_name] = faker.name.findName();
            requestValue[config.users.email] = faker.internet.email();
            requestValue[config.users.age] = 16
            requestValue[config.users.password] = '12345678';
            const req = { body: requestValue }; //request with password raw
            const stubValue = { ...requestValue };
            stubValue[config.users.password] = md5('12345678'); // the password stub receive is hash.
            const stubCheckUser = sinon.stub(userService, "getUserById").returns();
            const stubCreate = sinon.stub(userService, "create").returns(stubValue);
            userController = new UserController(userService);
            userController.postUser(req, res);
            expect(stubCheckUser.calledOnce).to.be.true;
            expect(stubCreate.calledOnce).to.be.true;
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(201);
            expect(json.calledOnce).to.be.true;        
            expect(json.args[0][0].data).to.equal(stubValue);
        });
    });

    describe("getUserById", function () {
        let req;
        let res;
        let userService;
        let status;
        let json;
        const stubValue = {};

        stubValue[config.users.first_name] = faker.name.findName();
        stubValue[config.users.last_name] = faker.name.findName();
        stubValue[config.users.email] = faker.internet.email();
        stubValue[config.users.age] = 16
        stubValue[config.users.password] = md5('12345678');
        stubValue[config.users.confirm_password] = md5('12345678');
        beforeEach(() => {
            req = { params: { id: faker.random.uuid() } };
            status = sinon.stub();
            json = sinon.spy();
            res = { status, json };
            status.returns(res);
            const userRepo = sinon.spy();
            userService = new UserService(userRepo);
        });

        it("should return a user that matches the id param", async function () {

            stubValue[config.users.id] = req.params.id;
            const stub = sinon.stub(userService, "getUserById").returns(stubValue);
            userController = new UserController(userService);
            userController.getUserById(req, res);
            expect(stub.calledOnce).to.be.true;
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0].msg).to.equal(config.msg.ok);
            expect(json.args[0][0].data.user).to.equal(stubValue);
        });

        it("should not return a user that not matches the id param", async function () {
            stubValue[config.users.id] = req.params.id;
            const stub = sinon.stub(userService, "getUserById").returns();
            userController = new UserController(userService);
            userController.getUserById(req, res);
            expect(stub.calledOnce).to.be.true;
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0].msg).to.equal(config.msg.users.userDoesNotExist);
            expect(json.args[0][0].data).to.equal(null);
        });
    });
});