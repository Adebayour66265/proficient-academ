require('dotenv').config();
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
    const client = await MongoClient.connect(process.env.MONGODB_URL);
    database = client.db('blog');
}


function getDb() {
    if (!database) {
        throw { message: 'Database connection is not connect' };
    }
    return database;
}

module.exports = {
    connectToDatabase: connectToDatabase,
    getDb: getDb
};
