const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let mongodbURL = 'mongodb://localhost:27017';

if (process.env.MONGODB_URL) {
    mongodbURL = process.env.MONGODB_URL;
}
let database;

async function connectToDatabase() {
    const client = await MongoClient.connect(mongodbURL);
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