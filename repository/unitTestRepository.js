const md5 = require('md5');
const jwt = require('jsonwebtoken');
const config = require('../config');
const client = require('../redisClient');
const secretKey = config.secretKey;
const { validationResult } = require('express-validator');

class UnitTestRepository {

    // get token
    getToken(req, res) {
        var errorsResult = validationResult(req);
        if (!errorsResult.isEmpty()) {
            return res.status(400).json(
                {
                    statusCode: 400,
                    msg: `${config.msg.badRequest} ${errorsResult.errors[0].msg}`,
                    data: null
                });
        }

        var users = [
            {
                id: 'hanhduykaka',
                password: md5('12345678')
            }
        ];


        users.find(x => x.id === req.body.id, function (err, obj) {
            if (!obj) {
                return res.status(200).json(
                    {
                        statusCode: 200,
                        msg: config.msg.users.userDoesNotExist,
                        data: { token: '' }
                    });
            } else {
                const objModel = JSON.parse(obj);
                if (objModel.password !== md5(req.body.password)) {
                    return res.status(200).json(
                        {
                            statusCode: 200,
                            msg: config.msg.users.passwordNotCorrect,
                            data: { token: '' }
                        });
                }
                jwt.sign(
                    { objModel },
                    secretKey,
                    { expiresIn: config.timeOut, algorithm: config.algorithms },
                    (err, token) => {
                        return res.status(200).json(
                            {
                                statusCode: 200,
                                msg: config.msg.ok,
                                data: { token: token }
                            });

                    });
            }
        })
    }


}

module.exports = UnitTestRepository;
