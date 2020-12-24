const config = require('../config');
const client = require('../redisClient');

async function findOne(id) {
    const user = await client.hget(config.tblUserName, id);
    return user ? JSON.parse(user) : user; // string if success// null if not exist.
}

async function create(user) {
    const userCreated = await client.hset(config.tblUserName, user[config.users.id], JSON.stringify(user));
    return userCreated; // 1 if create, 0 with update
}

async function getAll() {
    const users = await client.hgetall(config.tblUserName);
    if (!users) {
        return null;
    }
    let result = [];
    for (const [key, value] of Object.entries(users)) {
        const user = JSON.parse(value);
        result.push(
            user
        );
    }
    return result; 
}

async function deleteOne(id) {
    const rs = await client.hdel(config.tblUserName, id);
    return rs; // 1 if success, 0 if not success - does not exist
}

module.exports = { findOne, create, getAll, deleteOne }