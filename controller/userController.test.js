
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

        it("should not postUser a user when id param is not provided", async function () {

            const stubValue = {};
            stubValue[config.users.first_name] = faker.name.findName();
            stubValue[config.users.last_name] = faker.name.findName();
            stubValue[config.users.email] = faker.internet.email();
            stubValue[config.users.age] = 16
            stubValue[config.users.password] = md5('12345678');
            stubValue[config.users.confirm_password] = md5('12345678');
            const req = { body: stubValue };
            userController = new UserController(userService);
            await userController.postUser(req, res);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(400);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0].msg).to.equal(`${config.msg.badRequest} ${config.msg.field} ${config.users.id} ${config.msg.users.canNotBeEmpty}`);
        });

        //     it("should not register a user when name and email params are not provided", async function () {
        //         const req = { body: {} };
        //         await new UserController().register(req, res);
        //         expect(status.calledOnce).to.be.true;
        //         expect(status.args\[0\][0]).to.equal(400);
        //         expect(json.calledOnce).to.be.true;
        //         expect(json.args\[0\][0].message).to.equal("Invalid Params");
        //     });
        //     it("should not register a user when email param is not provided", async function () {
        //         const req = { body: { name: faker.name.findName() } };
        //         await new UserController().register(req, res);
        //         expect(status.calledOnce).to.be.true;
        //         expect(status.args\[0\][0]).to.equal(400);
        //         expect(json.calledOnce).to.be.true;
        //         expect(json.args\[0\][0].message).to.equal("Invalid Params");
        //     });
        //     it("should register a user when email and name params are provided", async function () {
        //         const req = {
        //             body: { name: faker.name.findName(), email: faker.internet.email() }
        //         };
        //         const stubValue = {
        //             id: faker.random.uuid(),
        //             name: faker.name.findName(),
        //             email: faker.internet.email(),
        //             createdAt: faker.date.past(),
        //             updatedAt: faker.date.past()
        //         };
        //         const stub = sinon.stub(userService, "create").returns(stubValue);
        //         userController = new UserController(userService);
        //         await userController.register(req, res);
        //         expect(stub.calledOnce).to.be.true;
        //         expect(status.calledOnce).to.be.true;
        //         expect(status.args\[0\][0]).to.equal(201);
        //         expect(json.calledOnce).to.be.true;
        //         expect(json.args\[0\][0].data).to.equal(stubValue);
        //     });
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