const express = require('express');
const mongodb = require('mongodb');
const session = require('express-session');

const db = require('../data/database');
const bcrypt = require('bcryptjs');

// const router = require("./blog");
const router = express.Router();


router.post('/signup', async function (req, res) {
    const userData = req.body;
    const enteredEmail = userData.email;
    const enteredConfirmEmail = userData['confirm-email'];
    const enteredPassword = userData.password;

    if (
        !enteredEmail ||
        !enteredConfirmEmail ||
        !enteredPassword ||
        enteredPassword.trim() < 6 ||
        enteredEmail !== enteredConfirmEmail ||
        !enteredEmail.includes('@')
    ) {


        const existingUser = await db.getDb().collection('users').findOne({ email: enteredEmail });


        if (existingUser) {
            // console.log('User Already exist');
            req.session.inputData = {
                hasError: true,
                message: 'User Already exist',
                email: enteredEmail,
                confirmEmail: enteredConfirmEmail,
                password: enteredPassword
            };
            req.session.save(function () {
                res.redirect('/signup');
            });
            return;
        }
        // console.log('Incorect Input');
        req.session.inputData = {
            hasError: true,
            message: 'Incorect Input Please check your credentials',
            email: enteredEmail,
            confirmEmail: enteredConfirmEmail,
            password: enteredPassword
        };

        req.session.save(function () {
            res.redirect('/signup');
        });
        return;
    }



    const hashsedPasswrord = await bcrypt.hash(enteredPassword, 12);
    const user = {
        email: enteredEmail,
        password: hashsedPasswrord,
    };
    const result = await db.getDb().collection('users').insertOne(user);

    res.redirect('/login');
    console.log(result);
});

router.get('/signup', function (req, res) {
    let sessionInputData = req.session.inputData;

    if (!sessionInputData) {
        sessionInputData = {
            hasError: false,
            email: '',
            password: '',
        }
    }
    req.session.inputData = null;
    res.render('new-user', { inputData: sessionInputData });
});

router.post('/login', async function (req, res, next) {
    const userData = req.body;
    const enteredEmail = userData.email;
    const enteredPassword = userData.password;

    const existingUser = await db.getDb()
        .collection('users')
        .findOne({ email: enteredEmail });

    if (!existingUser) {
        // console.log('Could not login ');
        req.session.inputData = {
            hasError: true,
            message: 'Could not login Check your credentials !',
            email: enteredEmail,
            password: enteredPassword
        }
        req.session.save(function () {
            res.redirect('/login');
        });
        return;
    }

    let passwordAreEqual;
    try {
        passwordAreEqual = await bcrypt.compare(
            enteredPassword,
            existingUser.password
        );
    } catch (error) {
        next(error);
    }
    if (!passwordAreEqual) {
        // console.log('Password are not equal');
        req.session.inputData = {
            hasError: true,
            message: 'Password are not Correct !',
            email: enteredEmail,
            password: enteredPassword
        }
        req.session.save(function () {
            res.redirect('/login');
        });
        return;
    }

    // console.log('User is Authenticated');
    req.session.user = {
        id: existingUser._id,
        email: existingUser.email,

    }
    req.session.isAuthenticated = true;
    req.session.save(function () {
        res.redirect('/newpost');
    });
});
router.get('/login', function (req, res) {

    let sessionInputData = req.session.inputData;

    if (!sessionInputData) {
        sessionInputData = {
            hasError: false,
            email: '',
            password: '',
        }
    }
    req.session.inputData = null;
    res.render('login', { inputData: sessionInputData });
});

router.post('/logout', function (req, res) {
    req.session.user = null;
    req.session.isAuthenticated = false;
    res.redirect('/login');
});

router.get('/profile', async function (req, res) {
    if (!res.locals.isAuth) {
        return res.status(401).render('401');
    }
    let authors;
    try {
        authors = await db.getDb().collection('authors').find().toArray();
    } catch (error) {
        next(error)
    }
    // res.render('new-post', { authors: authors });
    res.render('profile', { authors: authors });
});


module.exports = router