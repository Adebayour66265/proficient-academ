const mongodb = require('mongodb');
const db = require('../data/database');
require('dotenv').config();

async function auth(req, res, next) {
    const user = req.session.user;
    const isAuth = req.session.isAuthenticated;

    if (!user || !isAuth) {
        return next();
    }

    const userDoc = await db.getDb().collection('users').findOne({ _id: user.id });
<<<<<<< HEAD

    // const isAdmin = userDoc.isAdmin;

    res.locals.isAuth = isAuth;
    // res.locals.isAdmin = isAdmin;
=======
    //const isAdmin = userDoc.isAdmin;

    res.locals.isAuth = isAuth;
   // res.locals.isAdmin = isAdmin;
>>>>>>> 6d24c6a5b7b452ebf8d5408720319e67933982df

    next();  
}

module.exports = auth;
