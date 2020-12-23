
const md5 = require('md5');
const config = require('../config');
const { validationResult } = require('express-validator');
const { userService } = require('../serviceLocator');
const jwt = require('jsonwebtoken');
const secretKey = config.secretKey;

//get all users
async function getUsers(req, res) {
    const obj = await userService.getAll();
    if (!obj) {
        return res.status(200).json(
            {
                statusCode: 200,
                msg: config.msg.users.doesNotHaveAny,
                data: null
            });

    } else {
        let result = [];
        for (const [key, value] of Object.entries(obj)) {
            const user = JSON.parse(value);
            result.push(
                user
            );
        }
        return res.status(200).json(
            {
                statusCode: 200,
                msg: config.msg.ok,
                data: { users: result }
            });
    }
}

//create user
async function postUser(req, res) {
    var errorsResult = validationResult(req);
    const id = req.body.id;
    const checkUser = await userService.getUserById(id);
    if (checkUser) {
        return res.status(400).json(
            {
                statusCode: 400,
                msg: `${config.msg.badRequest} ${config.msg.users.userWithId} ${id} ${config.msg.users.alreadyUse}`,
                data: null
            });
    }
    if (!errorsResult.isEmpty()) {
        return res.status(400).json(
            {
                statusCode: 400,
                msg: `${config.msg.badRequest} ${errorsResult.errors[0].msg}`,
                data: null
            });
    }
    const createResult = await setData(id, req, res);
    if (createResult != null) {
        return res.status(201).json(
            {
                statusCode: 201,
                msg: config.msg.ok,
                data: null
            });
    }
    return res.status(200).json(
        {
            statusCode: 200,
            msg: config.msg.notSuccess,
            data: null
        });
}

//update user
async function putUser(req, res) {
    let errorsResult = validationResult(req);
    const id = req.params.id;
    const checkUser = await userService.getUserById(id);
    if (!checkUser) {
        return res.status(400).json(
            {
                statusCode: 400,
                msg: `${config.msg.badRequest} ${config.msg.users.userWithId} ${id} ${config.msg.users.doesNotExist}`,
                data: null
            });
    }
    if (!errorsResult.isEmpty()) {
        return res.status(400).json(
            {
                statusCode: 400,
                msg: `${config.msg.badRequest} ${errorsResult.errors[0].msg}`,
                data: null
            });
    }
    const createResult = await setData(id, req, res);
    if (createResult != null) {
        return res.status(200).json(
            {
                statusCode: 200,
                msg: config.msg.ok,
                data: null
            });
    }
    return res.status(200).json(
        {
            statusCode: 200,
            msg: config.msg.notSuccess,
            data: null
        });
}

//get user by id 
async function getUserById(req, res) {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
        return res.status(200).json(
            {
                statusCode: 200,
                msg: config.msg.users.userDoesNotExist,
                data: null
            });
    } else {
        return res.status(200).json(
            {
                statusCode: 200,
                msg: config.msg.ok,
                data: { user: user }
            });
    }
}

//delete user
async function deleteUser(req, res) {
    const id = req.params.id;
    const result = await userService.delete(id);
    if (result == '0') {
        return res.status(200).json(
            {
                statusCode: 200,
                msg: `${config.msg.users.userWithId} ${id} ${config.msg.users.doesNotExist}`,
                data: null
            });
    } else {
        return res.status(200).json(
            {
                statusCode: 200,
                msg: config.msg.ok,
                data: null
            });
    }
}

//login to get token
async function getToken(req, res) {
    var errorsResult = validationResult(req);
    if (!errorsResult.isEmpty()) {
        return res.status(400).json(
            {
                statusCode: 400,
                msg: `${config.msg.badRequest} ${errorsResult.errors[0].msg}`,
                data: null
            });
    }
    const checkUser = await userService.getUserById(req.body.id);
    if (!checkUser) {
        return res.status(200).json(
            {
                statusCode: 200,
                msg: config.msg.users.userDoesNotExist,
                data: { token: '' }
            });
    } else {
        if (checkUser.password !== md5(req.body.password)) {
            return res.status(200).json(
                {
                    statusCode: 200,
                    msg: config.msg.users.passwordNotCorrect,
                    data: { token: '' }
                });
        }
        jwt.sign(
            { checkUser },
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
}

//sub function handle set data to redis
async function setData(id, req, res) {
    let userRequest = {};
    userRequest[config.users.id] = id;
    userRequest[config.users.first_name] = req.body.first_name;
    userRequest[config.users.last_name] = req.body.last_name;
    userRequest[config.users.email] = req.body.email;
    userRequest[config.users.age] = req.body.age;
    userRequest[config.users.password] = md5(req.body.password);
    try {
        const createUser = await userService.create(userRequest);
        return createUser;
    } catch (error) {
        console.log(error)
        console.log(createUser)
        return null
    }
}

module.exports = { putUser, deleteUser, getToken, postUser, getUserById, getUsers }

