const config = require('../config');
const client = require('../redisClient');

async function findOne(id) {
    const user = await client.hget(config.tblUserName, id);
    return user ? JSON.parse(user) : user;
}

async function create(user) {
    const userCreated = await client.hset(config.tblUserName, user[config.users.id], JSON.stringify(user));
    return userCreated;
}

module.exports = { findOne, create }