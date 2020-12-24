const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const expect = chai.expect;
const config = require('../config');
const faker = require('faker');
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);

describe('Validator', () => {

    describe('checkUser', () => {

        const stubValue = {};
        stubValue[config.users.id] = faker.random.uuid();
        stubValue[config.users.first_name] = faker.name.findName();;
        stubValue[config.users.last_name] = faker.name.findName();;
        stubValue[config.users.email] = faker.internet.email();
        stubValue[config.users.age] = 14;
        stubValue[config.users.password] = '12345678';
        stubValue[config.users.confirm_password] = '12345678';
        const genToken = jwt.sign(
            { stubValue },
            config.secretKey,
            { expiresIn: config.timeOut, algorithm: config.algorithms }
        );

        it('it should not post/put with invalid email', async () => {
            let user = { ...stubValue };
            user[config.users.email] = 'teonguyen';

            //Post
            const result = await chai.request(app).post(config.url.users.add).send(user);
            expect(result.body.data).to.equal(null);
            result.should.have.status(400);
            should.equal(result.body.data, null);
            should.equal(result.body.msg, `${config.msg.badRequest} ${config.msg.users.invalidEmail}`);

            //Put
            const resultPut = await chai.request(app)
                .put(config.url.users.user + user[config.users.id])
                .set({ 'Authorization': `Bearer ${genToken}` })
                .send(user);
            expect(resultPut.body.data).to.equal(null);
            resultPut.should.have.status(400);
            should.equal(resultPut.body.data, null);
            should.equal(resultPut.body.msg, `${config.msg.badRequest} ${config.msg.users.invalidEmail}`);
        });

        it('it should not post/put with empty field email', async () => {
            let user = { ...stubValue };
            user[config.users.email] = '';

            //Post
            const result = await chai.request(app).post(config.url.users.add).send(user);
            expect(result.body.data).to.equal(null);
            result.should.have.status(400);
            should.equal(result.body.data, null);
            should.equal(result.body.msg, `${config.msg.badRequest} ${config.msg.field} ${config.users.email} ${config.msg.users.canNotBeEmpty}`);

            //Put
            const resultPut = await chai.request(app)
                .put(config.url.users.user + user[config.users.id])
                .set({ 'Authorization': `Bearer ${genToken}` })
                .send(user);
            expect(resultPut.body.data).to.equal(null);
            resultPut.should.have.status(400);
            should.equal(resultPut.body.data, null);
            should.equal(resultPut.body.msg, `${config.msg.badRequest} ${config.msg.field} ${config.users.email} ${config.msg.users.canNotBeEmpty}`);
        });

        it('it should not post/put with password less than 8 char', async () => {
            let user = { ...stubValue };
            user[config.users.password] = '1234567';

            //post
            const result = await chai.request(app).post(config.url.users.add).send(user);
            expect(result.body.data).to.equal(null);
            result.should.have.status(400);
            should.equal(result.body.data, null);
            should.equal(result.body.msg, `${config.msg.badRequest} ${config.msg.users.passAtLeast8Char}`);

            //Put
            const resultPut = await chai.request(app)
                .put(config.url.users.user + user[config.users.id])
                .set({ 'Authorization': `Bearer ${genToken}` })
                .send(user);
            expect(resultPut.body.data).to.equal(null);
            resultPut.should.have.status(400);
            should.equal(resultPut.body.data, null);
            should.equal(resultPut.body.msg, `${config.msg.badRequest} ${config.msg.users.passAtLeast8Char}`);
        });

        it('it should not post/put with password empty', async () => {
            let user = { ...stubValue };
            user[config.users.password] = '';

            //post
            const result = await chai.request(app).post(config.url.users.add).send(user);
            expect(result.body.data).to.equal(null);
            result.should.have.status(400);
            should.equal(result.body.data, null);
            should.equal(result.body.msg, `${config.msg.badRequest} ${config.msg.field} ${config.users.password} ${config.msg.users.canNotBeEmpty}`);

            //Put
            const resultPut = await chai.request(app)
                .put(config.url.users.user + user[config.users.id])
                .set({ 'Authorization': `Bearer ${genToken}` })
                .send(user);
            expect(resultPut.body.data).to.equal(null);
            resultPut.should.have.status(400);
            should.equal(resultPut.body.data, null);
            should.equal(resultPut.body.msg, `${config.msg.badRequest} ${config.msg.field} ${config.users.password} ${config.msg.users.canNotBeEmpty}`);
        });

        it('it should not post/put with confirm_password empty', async () => {
            let user = { ...stubValue };
            user[config.users.confirm_password] = '';

            //post
            const result = await chai.request(app).post(config.url.users.add).send(user);
            expect(result.body.data).to.equal(null);
            result.should.have.status(400);
            should.equal(result.body.data, null);
            should.equal(result.body.msg, `${config.msg.badRequest} ${config.msg.field} ${config.users.confirm_password} ${config.msg.users.canNotBeEmpty}`);

            //Put
            const resultPut = await chai.request(app)
                .put(config.url.users.user + user[config.users.id])
                .set({ 'Authorization': `Bearer ${genToken}` })
                .send(user);
            expect(resultPut.body.data).to.equal(null);
            resultPut.should.have.status(400);
            should.equal(resultPut.body.data, null);
            should.equal(resultPut.body.msg, `${config.msg.badRequest} ${config.msg.field} ${config.users.confirm_password} ${config.msg.users.canNotBeEmpty}`);

        });

        it('it should not post/put with confirm password and password mismatch', async () => {
            let user = { ...stubValue };
            user[config.users.confirm_password] = '123456789';

            //post
            const result = await chai.request(app).post(config.url.users.add).send(user);
            expect(result.body.data).to.equal(null);
            result.should.have.status(400);
            should.equal(result.body.data, null);
            should.equal(result.body.msg, `${config.msg.badRequest} ${config.msg.users.confirmPasswordMismatch}`);

            //Put
            const resultPut = await chai.request(app)
                .put(config.url.users.user + user[config.users.id])
                .set({ 'Authorization': `Bearer ${genToken}` })
                .send(user);
            expect(resultPut.body.data).to.equal(null);
            resultPut.should.have.status(400);
            should.equal(resultPut.body.data, null);
            should.equal(resultPut.body.msg, `${config.msg.badRequest} ${config.msg.users.confirmPasswordMismatch}`);
        });

        it('it should not post with empty field id', async () => {
            let user = { ...stubValue };
            user[config.users.id] = '';

            //post
            const result = await chai.request(app).post(config.url.users.add).send(user);
            expect(result.body.data).to.equal(null);
            result.should.have.status(400);
            should.equal(result.body.data, null);
            should.equal(result.body.msg, `${config.msg.badRequest} ${config.msg.field} ${config.users.id} ${config.msg.users.canNotBeEmpty}`);
        });
    });

    describe('checkLogin', () => {

        it('it should not get the token when empty field id', async () => {
            const loginInfo = {};
            loginInfo[config.users.password] = '12345678';
            const result = await chai.request(app).post(config.url.login).send(loginInfo)
            result.should.have.status(400);
            should.equal(result.body.data, null);
            result.body.msg.should
                .eql(`${config.msg.badRequest} ${config.msg.field} ${config.users.id} ${config.msg.users.canNotBeEmpty}`);

        });

        it('it should not get the token when empty field password', async () => {
            const loginInfo = {};
            loginInfo[config.users.id] = '1';
            const result = await chai.request(app).post(config.url.login).send(loginInfo);
            result.should.have.status(400);
            should.equal(result.body.data, null);
            result.body.msg.should
                .eql(`${config.msg.badRequest} ${config.msg.field} ${config.users.password} ${config.msg.users.canNotBeEmpty}`);


        });
    });

});