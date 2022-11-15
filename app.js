// FILE PATH
const path = require('path');
//  FILE SYSTEM
const fs = require('fs');
//  EXPRESS REQUIRE
const express = require('express');
const session = require('express-session');
// const csrf = require('csurf');
const sessionConfig = require('./config/session');
const authMiddleware = require('./middlewares/auth.mwiddleware');
const bcrypt = require('bcryptjs');
const db = require('./data/database');
const Post = require('./models/post');

// const res = require('express/lib/response');
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth.routh');

const mongoSessionDbStore = sessionConfig.ceateSessionStore(session);
// EXPRESS APP FUNCTION


let port = 3000;
if (process.env.PORT) {
    port = process.env.PORT
}

const app = express();



// VIEW ENGINE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



//  STATIC FILE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/images', express.static('images'));

app.use(session(sessionConfig.createSessionConfig(mongoSessionDbStore)));

// app.use(csrf());

app.use(authMiddleware);

app.use(blogRoutes);
app.use(authRoutes);


app.use(function (error, req, res, next) {
    res.status(500).render('500');
});



db.connectToDatabase().then(function () {
    app.listen(port, () => {
        console.log(`Connected sucessfully with Server ${port}`);
    })
});

