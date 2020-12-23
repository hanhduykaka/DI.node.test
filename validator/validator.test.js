const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const expect = chai.expect;
const config = require('../config');
const md5 = require('md5');

chai.use(chaiHttp);

describe('Validator', () => {

    describe('checkUser', () => {

        it('it should not post with invalid email', async () => {
            const id = '1';
            let user = {};
            user[config.users.id] = id;
            user[config.users.first_name] = 'teo';
            user[config.users.last_name] = 'nguyen';
            user[config.users.email] = 'teonguyen';
            user[config.users.age] = 14;
            user[config.users.password] = md5('12345678');
            user[config.users.confirm_password] = md5('12345678');
            const result =  await chai.request(app).post(config.url.users.add).send(user);
             expect(result.body.data).to.equal(null);
            result.should.have.status(400);
            should.equal(result.body.data, null);
            should.equal(result.body.msg, `${config.msg.badRequest} ${config.msg.users.invalidEmail}`);
        });

        // it('it should not post with empty field email', async (done) => {
        //     const id = '1';
        //     let user = {};
        //     user[config.users.id] = id;
        //     user[config.users.first_name] = 'teo';
        //     user[config.users.last_name] = 'nguyen';
        //     user[config.users.age] = 14;
        //     user[config.users.password] = md5('12345678');
        //     user[config.users.confirm_password] = md5('12345678');
        //     chai.request(app).post(config.url.users.add).send(user).end((err, res) => {
        //         res.should.have.status(400);
        //         should.equal(res.body.data, null);
        //         res.body.msg.should.eql(`${config.msg.badRequest} ${config.msg.field} ${config.users.email} ${config.msg.users.canNotBeEmpty}`);
        //         done();
        //     })
        // });

        // it('it should not post with password less than 8 char', async (done) => {
        //     const id = '1';
        //     let user = {};
        //     user[config.users.id] = id;
        //     user[config.users.first_name] = 'teo';
        //     user[config.users.last_name] = 'nguyen';
        //     user[config.users.email] = 'teonguyen@gmail.com';
        //     user[config.users.age] = 14;
        //     user[config.users.password] = '1234567';
        //     user[config.users.confirm_password] = '1234567';
        //     chai.request(app).post(config.url.users.add).send(user).end((err, res) => {
        //         res.should.have.status(400);
        //         should.equal(res.body.data, null);
        //         res.body.msg.should.eql(`${config.msg.badRequest} ${config.msg.users.passAtLeast8Char}`);
        //         done();
        //     })
        // });

        // it('it should not post with password empty', async (done) => {
        //     const id = '1';
        //     let user = {};
        //     user[config.users.id] = id;
        //     user[config.users.first_name] = 'teo';
        //     user[config.users.last_name] = 'nguyen';
        //     user[config.users.email] = 'teonguyen@gmail.com';
        //     user[config.users.age] = 14;
        //     chai.request(app).post(config.url.users.add).send(user).end((err, res) => {
        //         res.should.have.status(400);
        //         should.equal(res.body.data, null);
        //         res.body.msg.should.eql(`${config.msg.badRequest} ${config.msg.field} ${config.users.password} ${config.msg.users.canNotBeEmpty}`);
        //         done();
        //     })
        // });

        // it('it should not post with confirm password empty', async (done) => {
        //     const id = '1';
        //     let user = {};
        //     user[config.users.id] = id;
        //     user[config.users.first_name] = 'teo';
        //     user[config.users.last_name] = 'nguyen';
        //     user[config.users.email] = 'teonguyen@gmail.com';
        //     user[config.users.age] = 14;
        //     user[config.users.password] = md5('12345678');
        //     chai.request(app).post(config.url.users.add).send(user).end((err, res) => {
        //         res.should.have.status(400);
        //         should.equal(res.body.data, null);
        //         res.body.msg.should.eql(`${config.msg.badRequest} ${config.msg.field} ${config.users.confirm_password} ${config.msg.users.canNotBeEmpty}`);
        //         done();
        //     })
        // });

        // it('it should not post with confirm password and password mismatch', async (done) => {
        //     const id = '1';
        //     let user = {};
        //     user[config.users.id] = id;
        //     user[config.users.first_name] = 'teo';
        //     user[config.users.last_name] = 'nguyen';
        //     user[config.users.email] = 'teonguyen@gmail.com';
        //     user[config.users.age] = 14;
        //     user[config.users.password] = md5('12345678');
        //     user[config.users.confirm_password] = md5('1234567');
        //     chai.request(app).post(config.url.users.add).send(user).end((err, res) => {
        //         res.should.have.status(400);
        //         should.equal(res.body.data, null);
        //         res.body.msg.should.eql(`${config.msg.badRequest} ${config.msg.users.confirmPasswordMismatch}`);
        //         done();
        //     })
        // });

        // it('it should not post with empty field id', async (done) => {
        //     let user = {};
        //     user[config.users.first_name] = 'teo';
        //     user[config.users.last_name] = 'nguyen';
        //     user[config.users.email] = 'teonguyen@gmail.com';
        //     user[config.users.age] = 14;
        //     user[config.users.password] = md5('12345678');
        //     user[config.users.confirm_password] = md5('12345678');
        //     chai.request(app).post(config.url.users.add).send(user).end((err, res) => {
        //         res.should.have.status(400);
        //         should.equal(res.body.data, null);
        //         res.body.msg.should.eql(`${config.msg.badRequest} ${config.msg.field} ${config.users.id} ${config.msg.users.canNotBeEmpty}`);
        //         done();
        //     })
        // });
    });

    // describe('checkLogin', () => {

    //     it('it should not get the token when empty field id', async (done) => {
    //         const loginInfo = {};
    //         loginInfo[config.users.password] = '12345678';
    //         chai.request(app).post(config.url.login).send(loginInfo).end((err, res) => {
    //             res.should.have.status(400);
    //             should.equal(res.body.data, null);
    //             res.body.msg.should
    //                 .eql(`${config.msg.badRequest} ${config.msg.field} ${config.users.id} ${config.msg.users.canNotBeEmpty}`);
    //             done();
    //         });
    //     });

    //     it('it should not get the token when empty field password', async (done) => {
    //         const loginInfo = {};
    //         loginInfo[config.users.id] = '1';
    //         chai.request(app).post(config.url.login).send(loginInfo).end((err, res) => {
    //             res.should.have.status(400);
    //             should.equal(res.body.data, null);
    //             res.body.msg.should
    //                 .eql(`${config.msg.badRequest} ${config.msg.field} ${config.users.password} ${config.msg.users.canNotBeEmpty}`);
    //             done();
    //         });
    //     });
    // });

});