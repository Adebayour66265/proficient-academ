const express = require('express');
const mongodb = require('mongodb');
const session = require('express-session');
const xss = require('xss');

const multer = require('multer');

const storageConfig = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({
    storage: storageConfig,
});
const db = require('../data/database');

// const Post = require('../models/post');

const ObjectId = mongodb.ObjectId;
const router = express.Router();


router.get('/', function (req, res) {
    res.render('school');
});
router.get('/contact', function (req, res) {
    res.render('contact');
});
router.get('/posts', async function (req, res, next) {
    let posts;
    try {
        posts = await db.getDb()
            .collection('posts')
            .find({}, { title: 1, summary: 1, image: 1, 'author.name': 1 })
            .toArray();
    } catch (error) {
        next(error)
    }
    res.render('post', { posts: posts });

});

router.get('/newpost', async function (req, res, next) {
    let authors;
    try {
        authors = await db.getDb().collection('authors').find().toArray();
    } catch (error) {
        next(error)
    }
    res.render('new-post', { authors: authors });
});

router.post('/posts', upload.single('image'), async function (req, res, next) {
    const uploadedImageFile = req.file;

    let authorId;
    try {
        authorId = new ObjectId(req.body.author);

    } catch (error) {
        next(error);
    }
    let author;
    try {
        author = await db.getDb().collection('authors').findOne({ _id: authorId });
    } catch (error) {
        next(error);
    }
    const newPost = {
        title: xss(req.body.title),
        summary: xss(req.body.summary),
        body: xss(req.body.content),
        image: uploadedImageFile.path,
        date: new Date(),
        author: {
            id: authorId,
            name: author.name,
            email: author.email
        }
    };
    const result = await db.getDb().collection('posts').insertOne(newPost);
    res.redirect('/posts');
});
router.get('/posts/:id', async function (req, res, next) {
    let postId = req.params.id;
    try {
        postId = new ObjectId(postId)
    } catch (error) {
        return res.status(404).render('404');
        // next(error)
    }
    let post;
    try {
        post = await db.getDb().collection('posts').findOne({ _id: postId }, { summary: 0 });
    } catch (error) {
        next(error)
    }

    if (!post) {
        return res.status(404).render('404');
    };
    post.humanReadableDate = post.date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    post.date = post.date.toISOString();
    res.render('post-details', { post: post });
});

router.get('/posts/:id/edit', async function (req, res, next) {
    const postId = req.params.id;
    let post;
    try {
        post = await db.getDb()
            .collection('posts')
            .findOne({ _id: new ObjectId(postId) },
                { title: 1, summary: 1, image: 1, body: 1 });
    } catch (error) {
        next(error)
    }
    if (!post) {
        return res.status(404).render('404');
    };
    res.render('update-post', { post: post });
});

router.post('/posts/:id/edit', async function (req, res, next) {
    let postId;
    try {
        postId = new ObjectId(req.params.id);
    } catch (error) {
        next(error);
    }

    let result;
    try {
        result = await db.getDb()
            .collection('posts')
            .updateOne({ _id: postId }, {
                $set: {
                    title: req.body.title,
                    summary: req.body.summary,
                    body: req.body.content
                }
            });
    } catch (error) {
        // next(error);
        res.status(404).render('404')
    }

    res.redirect('/posts');
});

router.post('/posts/:id/delete', async function (req, res, next) {
    let postId;
    try {
        postId = new ObjectId(req.params.id);
    } catch (error) {
        next(error);
    }
    let result;
    try {
        result = await db.getDb().collection('posts').deleteOne({ _id: postId });
    } catch (error) {
        res.status(404).render("404");
    }
    res.redirect('/posts');
});

router.get('/posts/:id/comments', async function (req, res, next) {
    let postId;
    try {
        postId = new ObjectId(req.params.id);
    } catch (error) {
        next(error);
    }
    const comments = await db
        .getDb()
        .collection('comments')
        .find({ postId: postId }).toArray();
    return res.json(comments);
});

router.post('/posts/:id/comments', async function (req, res, next) {
    let postId
    try {
        postId = new ObjectId(req.params.id);
    } catch (error) {
        next(error);
    }
    const newComment = {
        postId: postId,
        title: req.body.title,
        text: req.body.text
    }
    const result = await db.getDb().collection('comments').insertOne(newComment);

    console.log(result);
    res.json({ message: 'Comment Added' });
});

router.get('/admin', async function (req, res, next) {
    if (!res.locals.isAuth) {
        return res.status(401).render('401');
    }


    if (!res.locals.isAdmin) {
        return res.status(403).render('403');
    }


    let posts
    try {
        posts = await db.getDb()
            .collection('posts')
            .find().toArray();
    } catch (error) {
        next(error);
    }

    let comments;
    try {
        comments = await db.getDb()
            .collection('comments')
            .find().toArray();
    } catch (error) {
        next(error);
    }
    let user;
    try {
        user = await db.getDb()
            .collection('users')
            .find().toArray();
    } catch (error) {
        next(error);
    }
    let sessionInputData = req.session.inputData;

    if (!sessionInputData) {
        sessionInputData = {
            hasError: false,
            title: '',
            content: '',
        };
    }

    req.session.inputData = null;

    res.render('admin', {
        posts: posts,
        inputData: sessionInputData,
        comments: comments,
        user: user
    });
});

router.delete('/posts/:id/comments/:id', async function (req, res, next) {
    let com = new ObjectId(req.params);
    let postId;
    try {
        postId = new ObjectId(req.params.id);
    } catch (error) {
        next(error);
    }

    let resultDelete;
    try {
         resultDelete = await
            db.getDb().collection('comments')
                .deleteOne({ _id: postId });
    } catch (error) {
        next(error)
    }

    console.log(resultDelete);
    res.json({ message: 'deleted' });
    // res.redirect('posts')

});
module.exports = router;