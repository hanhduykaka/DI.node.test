
const md5 = require('md5');
const config = require('../config');
const { validationResult } = require('express-validator');
const { userService } = require('../serviceLocator');


 async function getUsers(req, res) {
  //  userService.getUsers(req, res);
}
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
    let userRequest = {};
    userRequest[config.users.id] = id;
    userRequest[config.users.first_name] = req.body.first_name;
    userRequest[config.users.last_name] = req.body.last_name;
    userRequest[config.users.email] = req.body.email;
    userRequest[config.users.age] = req.body.age;
    userRequest[config.users.password] = md5(req.body.password);
    try {
        const createUser = await userService.create(userRequest);
        if (createUser == '1')//create success redis return 1
        {
            return res.status(201).json(
                {
                    statusCode: 201,
                    msg: config.msg.ok,
                    data: userRequest
                });
        }

    } catch (error) {
        console.log(error)
        console.log(createUser)
        return res.status(200).json(
            {
                statusCode: 200,
                msg: config.msg.notSuccess,
                data: userRequest
            });
    }

}

async function putUser(req, res) {
    //userService.postUser(req, res);
    return res.status(200).json(
        {
            statusCode: 200,
            msg: config.msg.users.userDoesNotExist,
            data: null
        });
}

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

async function deleteUser(req, res) {
    //userService.postUser(req, res);

}
async function getToken(req, res) {
    //userService.getToken(req, res);
}
// }





// // get all Users
// function getUsers(req, res) {
//     client.hgetall(config.tblUserName, function (err, obj) {
//         if (!obj) {
//             return res.status(200).json(
//                 {
//                     statusCode: 200,
//                     msg: config.msg.users.doesNotHaveAny,
//                     data: null
//                 });

//         } else {
//             let result = [];
//             for (const [key, value] of Object.entries(obj)) {
//                 const user = JSON.parse(value);
//                 result.push(
//                     user
//                 );
//             }
//             return res.status(200).json(
//                 {
//                     statusCode: 200,
//                     msg: config.msg.ok,
//                     data: { users: result }
//                 });
//         }
//     })
// }

// // get User by id
// function getUserById(req, res) {
//     const id = req.params.id;
//     client.hget(config.tblUserName, id, function (err, obj) {
//         if (!obj) {
//             return res.status(200).json(
//                 {
//                     statusCode: 200,
//                     msg: config.msg.users.userDoesNotExist,
//                     data: null
//                 });
//         } else {
//             return res.status(200).json(
//                 {
//                     statusCode: 200,
//                     msg: config.msg.ok,
//                     data: { user: JSON.parse(obj) }
//                 });
//         }
//     })
// }

// //  Add User 
// function postUser(req, res) {
//     var errorsResult = validationResult(req);
//     const id = req.body.id;
//     client.hget(config.tblUserName, id, (err, obj) => {
//         if (obj) {
//             const error =
//             {
//                 msg: `${config.msg.users.userWithId} ${id} ${config.msg.users.alreadyUse}`
//             };
//             errorsResult.errors.push(error);
//         }
//         if (!errorsResult.isEmpty()) {
//             return res.status(400).json(
//                 {
//                     statusCode: 400,
//                     msg: `${config.msg.badRequest} ${errorsResult.errors[0].msg}`,
//                     data: null
//                 });
//         }
//         setData(client, id, req, res);
//     })
// }

// //  edit User 
// function putUser(req, res) {
//     let errorsResult = validationResult(req);
//     const id = req.params.id;
//     client.hget(config.tblUserName, id, (err, obj) => {
//         if (!obj) {
//             const error =
//             {
//                 msg: `${config.msg.users.userWithId} ${id} ${config.msg.users.doesNotExist}`
//             };
//             errorsResult.errors.push(error);
//         }
//         if (!errorsResult.isEmpty()) {
//             return res.status(400).json(
//                 {
//                     statusCode: 400,
//                     msg: `${config.msg.badRequest} ${errorsResult.errors[0].msg}`,
//                     data: null
//                 });
//         }
//         setData(client, id, req, res);
//     })
// }

// //delete User
// function deleteUser(req, res) {
//     const id = req.params.id;
//     client.hget(config.tblUserName, id, function (err, obj) {
//         if (obj) {
//             client.hdel(config.tblUserName, id);
//             return res.status(200).json(
//                 {
//                     statusCode: 200,
//                     msg: config.msg.ok,
//                     data: null
//                 });
//         } else {
//             return res.status(200).json(
//                 {
//                     statusCode: 200,
//                     msg: `${config.msg.users.userWithId} ${id} ${config.msg.users.doesNotExist}`,
//                     data: null
//                 });
//         }
//     });
// }

// // get token
// function getToken(req, res) {
//     var errorsResult = validationResult(req);
//     if (!errorsResult.isEmpty()) {
//         return res.status(400).json(
//             {
//                 statusCode: 400,
//                 msg: `${config.msg.badRequest} ${errorsResult.errors[0].msg}`,
//                 data: null
//             });
//     }
//     client.hget(config.tblUserName, req.body.id, function (err, obj) {
//         if (!obj) {
//             return res.status(200).json(
//                 {
//                     statusCode: 200,
//                     msg: config.msg.users.userDoesNotExist,
//                     data: { token: '' }
//                 });
//         } else {
//             const objModel = JSON.parse(obj);
//             if (objModel.password !== md5(req.body.password)) {
//                 return res.status(200).json(
//                     {
//                         statusCode: 200,
//                         msg: config.msg.users.passwordNotCorrect,
//                         data: { token: '' }
//                     });
//             }
//             jwt.sign(
//                 { objModel },
//                 secretKey,
//                 { expiresIn: config.timeOut, algorithm: config.algorithms },
//                 (err, token) => {
//                     return res.status(200).json(
//                         {
//                             statusCode: 200,
//                             msg: config.msg.ok,
//                             data: { token: token }
//                         });

//                 });
//         }
//     })
// }

// //set data to redis
// function setData(client, id, req, res) {
//     const first_name = req.body.first_name;
//     const last_name = req.body.last_name;
//     const email = req.body.email;
//     const age = req.body.age;
//     let password = req.body.password;
//     password = md5(password);
//     var user = {};
//     user[config.users.id] = id;
//     user[config.users.first_name] = first_name;
//     user[config.users.last_name] = last_name;
//     user[config.users.email] = email;
//     user[config.users.age] = age;
//     user[config.users.password] = password;
//     client.hset(config.tblUserName, id, JSON.stringify(user)
//         , function (err, reply) {
//             if (err) {
//                 console.log(err)
//                 return res.status(res.statusCode).json(
//                     {
//                         statusCode: res.statusCode,
//                         msg: config.msg.notSuccess,
//                         data: null
//                     });
//             }
//             return res.status(res.statusCode).json(
//                 {
//                     statusCode: res.statusCode,
//                     msg: config.msg.ok,
//                     data: null
//                 });
//         });
// }
//getUsers,  putUser, deleteUser, getToken
module.exports = { putUser, deleteUser, getToken, postUser, getUserById ,getUsers }

