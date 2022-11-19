const mongodbStore = require('connect-mongodb-session');
require('dotenv').config();

function ceateSessionStore(session) {
    const MongoDBStore = mongodbStore(session);


    let mongodbUrl = 'mongodb://localhost:27017';

    if (process.env.MONGODB_URL) {
        mongodbUrl = process.env.MONGODB_URL
    }

    const sessionStore = new MongoDBStore({
        url: mongodbUrl,
        databaseName: 'blog',
        collection: 'sessions'
    });
    return sessionStore;
}

function createSessionConfig(sessionStore) {
    return {
        secret: 'super-secret',
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000
        }
    };

}


module.exports = {
    ceateSessionStore: ceateSessionStore,
    createSessionConfig: createSessionConfig
}