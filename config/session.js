const mongodbStore = require('connect-mongodb-session');

function ceateSessionStore(session) {
    const MongoDBStore = mongodbStore(session);


<<<<<<< HEAD
    let mongodbUrl = 'mongodb://localhost:27017'
=======
    let MONGODB_URL;

>>>>>>> 6befac38c34c4400bb9271abcd614617b1f05901
    if (process.env.MONGODB_URL) {
        url = process.env.MONGODB_URL;
    }
    const sessionStore = new MongoDBStore({
<<<<<<< HEAD
        //   mongodbUrl: 'mongodb://localhost:27017',
        url: mongodbUrl,
=======
          url: 'mongodb://localhost:27017',
        // url: '',
>>>>>>> 6befac38c34c4400bb9271abcd614617b1f05901
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
