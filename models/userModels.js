const config = require('../config');
const client = require('../redisClient');

function findOne(id) {
    client.hget(config.tblUserName, id, function (err, obj) {
        return { err, obj };
    })
}

function create(user) {
    client.hset(config.tblUserName, user[config.users.id], JSON.stringify(user)
        , function (err, obj) {
            return { err, obj };
        });

}

module.exports = { findOne, create }