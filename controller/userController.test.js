
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const faker = require('faker');
const md5 = require('md5');
const config = require('../config');
const UserController = require('./userController');
const UserService = require('../services/userService');
const jwt = require('jsonwebtoken');

describe('UserController', function () {

    const stubValue = {};
    stubValue[config.users.id] = faker.random.uuid();
    stubValue[config.users.first_name] = faker.name.findName();
    stubValue[config.users.last_name] = faker.name.findName();
    stubValue[config.users.email] = faker.internet.email();
    stubValue[config.users.age] = 16
    stubValue[config.users.password] = '12345678';

    describe('postUser', function () {
        let status, json, res, userService, userController

        beforeEach(() => {
            status = sinon.stub();
            json = sinon.spy();
            res = { json, status };
            status.returns(res);
            const userRepo = sinon.spy();
            userService = new UserService(userRepo);
        });

        it('should not postUser a user when id already used', async function () {
         
            const req = { body: stubValue };
            const stub = sinon.stub(userService, 'getUserById').returns(stubValue);
            userController = new UserController(userService);
            await userController.postUser(req, res);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(400);
            expect(json.calledOnce).to.be.true;
            expect(stub.calledOnce).to.be.true;
            expect(json.args[0][0].msg)
                .to.equal(`${config.msg.badRequest} ${config.msg.users.userWithId} ${stubValue[config.users.id]} ${config.msg.users.alreadyUse}`);
        });

        it('should not postUser a user when an error occur on database', async function () {
            const req = { body: stubValue };
            const stub = sinon.stub(userService, 'getUserById').returns();
            userController = new UserController(userService);
            const stubCreate = sinon.stub(userController, 'setData').returns(null);
            await userController.postUser(req, res);
            expect(status.calledOnce).to.be.true;
            expect(stubCreate.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(500);
            expect(json.calledOnce).to.be.true;
            expect(stub.calledOnce).to.be.true;
            expect(json.args[0][0].msg)
                .to.equal(config.msg.notSuccess);
        });

        it('should register a user when all field params are provided', async function () {
            const req = { body: stubValue }; //request with password raw
            const stubCheckUser = sinon.stub(userService, 'getUserById').returns();
            userController = new UserController(userService);
            const stubCreate = sinon.stub(userController, 'setData').returns('1');
            await userController.postUser(req, res);
            expect(stubCheckUser.calledOnce).to.be.true;
            expect(stubCreate.calledOnce).to.be.true;
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(201);
            expect(json.calledOnce).to.be.true;

        });
    });

    describe('putUser', function () {
        let status, json, res, userService, userController
        beforeEach(() => {
            status = sinon.stub();
            json = sinon.spy();
            res = { json, status };
            status.returns(res);
            const userRepo = sinon.spy();
            userService = new UserService(userRepo);
        });

        it('should not update a user when id does not exist in DB', async function () {
            const req = { body: stubValue };
            req.params = { id: stubValue[config.users.id] };
            const stub = sinon.stub(userService, 'getUserById').returns();
            userController = new UserController(userService);
            await userController.putUser(req, res);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(400);
            expect(json.calledOnce).to.be.true;
            expect(stub.calledOnce).to.be.true;
            expect(json.args[0][0].msg)
                .to.equal(`${config.msg.badRequest} ${config.msg.users.userWithId} ${req.params.id} ${config.msg.users.doesNotExist}`);
        });

        it('should not update a user when an error occur on database', async function () {
            const req = { body: stubValue };
            req.params = { id: stubValue[config.users.id] };
            const stub = sinon.stub(userService, 'getUserById').returns(stubValue);
            userController = new UserController(userService);
            const stubCreate = sinon.stub(userController, 'setData').returns(null);
            await userController.putUser(req, res);
            expect(status.calledOnce).to.be.true;
            expect(stubCreate.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(500);
            expect(json.calledOnce).to.be.true;
            expect(stub.calledOnce).to.be.true;
            expect(json.args[0][0].msg)
                .to.equal(config.msg.notSuccess);
        });

        it('should update a user when all field params are provided', async function () {
            const req = { body: stubValue }; //request with password raw
            req.params = { id: stubValue[config.users.id] };
            const stubCheckUser = sinon.stub(userService, 'getUserById').returns(stubValue);
            userController = new UserController(userService);
            const stubCreate = sinon.stub(userController, 'setData').returns('1');
            await userController.putUser(req, res);
            expect(stubCheckUser.calledOnce).to.be.true;
            expect(stubCreate.calledOnce).to.be.true;
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(200);
            expect(json.calledOnce).to.be.true;

        });
    });

    describe('getUserById', function () {
        let req;
        let res;
        let userService;
        let status;
        let json;

        beforeEach(() => {
            req = { params: { id: faker.random.uuid() } };
            status = sinon.stub();
            json = sinon.spy();
            res = { status, json };
            status.returns(res);
            const userRepo = sinon.spy();
            userService = new UserService(userRepo);
        });

        it('should return a user that matches the id param', async function () {
            stubValue[config.users.id] = req.params.id;
            const stub = sinon.stub(userService, 'getUserById').returns(stubValue);
            userController = new UserController(userService);
            await userController.getUserById(req, res);
            expect(stub.calledOnce).to.be.true;
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0].msg).to.equal(config.msg.ok);
            expect(status.args[0][0]).to.equal(200);
            expect(json.args[0][0].data.user).to.equal(stubValue);
        });

        it('should not return a user that not matches the id param', async function () {
            stubValue[config.users.id] = req.params.id;
            const stub = sinon.stub(userService, 'getUserById').returns();
            userController = new UserController(userService);
            await userController.getUserById(req, res);
            expect(stub.calledOnce).to.be.true;
            expect(json.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(200);
            expect(json.args[0][0].msg).to.equal(config.msg.users.userDoesNotExist);
            expect(json.args[0][0].data).to.equal(null);
        });
    });

    describe('getUsers', function () {
        let req;
        let res;
        let userService;
        let status;
        let json;
        let arrStub = [];
        arrStub.push(stubValue);

        beforeEach(() => {
            req = { params: { id: faker.random.uuid() } };
            status = sinon.stub();
            json = sinon.spy();
            res = { status, json };
            status.returns(res);
            const userRepo = sinon.spy();
            userService = new UserService(userRepo);
        });

        it('should return all user', async function () {
            const stub = sinon.stub(userService, 'getAll').returns(arrStub);
            userController = new UserController(userService);
            await userController.getUsers(req, res);
            expect(stub.calledOnce).to.be.true;
            expect(json.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(200);
            expect(json.args[0][0].msg).to.equal(config.msg.ok);
            expect(json.args[0][0].data.users).to.equal(arrStub);
        });

        it('should not return any user when data is empty', async function () {
            const stub = sinon.stub(userService, 'getAll').returns();
            userController = new UserController(userService);
            await userController.getUsers(req, res);
            expect(stub.calledOnce).to.be.true;
            expect(json.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(200);
            expect(json.args[0][0].msg).to.equal(config.msg.users.doesNotHaveAny);
            expect(json.args[0][0].data).to.equal(null);
        });
    });

    describe('deleteUser', function () {
        let req;
        let res;
        let userService;
        let status;
        let json;

        beforeEach(() => {
            req = { params: { id: faker.random.uuid() } };
            status = sinon.stub();
            json = sinon.spy();
            res = { status, json };
            status.returns(res);
            const userRepo = sinon.spy();
            userService = new UserService(userRepo);
        });

        it('should delete a user that matches the id param', async function () {
            const stub = sinon.stub(userService, 'delete').returns('1');
            userController = new UserController(userService);
            await userController.deleteUser(req, res);
            expect(stub.calledOnce).to.be.true;
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0].msg).to.equal(config.msg.ok);
            expect(status.args[0][0]).to.equal(200);
            expect(json.args[0][0].data).to.equal(null);
        });

        it('should not delete a user when request id does not exist in DB', async function () {
            const stub = sinon.stub(userService, 'delete').returns('0');
            userController = new UserController(userService);
            await userController.deleteUser(req, res);
            expect(stub.calledOnce).to.be.true;
            expect(json.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(200);
            expect(json.args[0][0].msg).to.equal(`${config.msg.users.userWithId} ${req.params.id} ${config.msg.users.doesNotExist}`);
            expect(json.args[0][0].data).to.equal(null);
        });
    });

    describe('getToken', function () {
        let req;
        let res;
        let userService;
        let status;
        let json;
        const stubValue = {};
        stubValue[config.users.id] = faker.random.uuid();
        stubValue[config.users.password] = md5('12345678');

        beforeEach(() => {      
            status = sinon.stub();
            json = sinon.spy();
            res = { status, json };
            status.returns(res);
            const userRepo = sinon.spy();
            userService = new UserService(userRepo);
        });

        it('should not return the token when id does not exist in DB', async function () {
            const requestBody = {...stubValue};
            requestBody[config.users.password] = '12345678';
            const req = { body: requestBody };
            const stub = sinon.stub(userService, 'getUserById').returns();
            userController = new UserController(userService);
            await userController.getToken(req, res);
            expect(stub.calledOnce).to.be.true;
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0].msg).to.equal(config.msg.users.userDoesNotExist);
            expect(status.args[0][0]).to.equal(200);
            expect(json.args[0][0].data.token).to.equal('');
        });

        it('should not return the token when password does not match', async function () {
            const requestBody = {...stubValue};
            requestBody[config.users.password] = '123456789';
            const req = { body: requestBody };
            const stub = sinon.stub(userService, 'getUserById').returns(stubValue);
            userController = new UserController(userService);
            await userController.getToken(req, res);
            expect(stub.calledOnce).to.be.true;
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0].msg).to.equal(config.msg.users.passwordNotCorrect);
            expect(status.args[0][0]).to.equal(200);
            expect(json.args[0][0].data.token).to.equal('');
        });

        it('should return the token', async function () {
            const requestBody = {...stubValue};
            requestBody[config.users.password] = '12345678';
            const req = { body: requestBody };
            const stub = sinon.stub(userService, 'getUserById').returns(stubValue);
            userController = new UserController(userService);
            const genToken = jwt.sign(
                { stubValue },
                config.secretKey,
                { expiresIn: config.timeOut, algorithm: config.algorithms }
            );
            const stubToken = sinon.stub(userController, 'generateToken').returns(genToken);
            await userController.getToken(req, res);
            expect(stub.calledOnce).to.be.true;
            expect(stubToken.calledOnce).to.be.true;
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0].msg).to.equal(config.msg.ok);
            expect(status.args[0][0]).to.equal(200);
            expect(json.args[0][0].data.token).to.equal(genToken);
        });
    });

});