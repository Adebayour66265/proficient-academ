const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let mongodbURL = 'mongodb+srv://Adebayour66265:Adebayour66265@cluster0.8114dlp.mongodb.net/?retryWrites=true&w=majority';

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