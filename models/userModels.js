const config = require('../config');
const client = require('../redisClient');

function findOne(id) {
    client.hget(config.tblUserName, id, function (err, obj) {
        if (!obj) {
            return { err, obj }
        }
        const user = JSON.parse(obj);
        return { err, user };
    })
}

function create(user) {
    client.hset(config.tblUserName, user[config.users.id], JSON.stringify(user)
        , function (err, obj) {
            if (!obj) {
                return { err, obj }
            }
            const user = JSON.parse(obj);
            return { err, user };
        });

}

module.exports = { findOne, create }