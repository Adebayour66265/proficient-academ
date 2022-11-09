const db = require('../data/database');
const xss = require('xss');

class Post {
    constructor(title, content, id, body, image, date) {
        this.title = title;
        this.content = content;
        this.id = id;
        this.body = body;
        this.image = image;
        this.date = date;
    }

    async save() {
        await db.getDb().collection('posts').insertOne({
            title: this.title,
            summary: this.summary,
            body: this.content,
            image: this.uploadedImageFile.path,
        });
    };
}

module.exports = Post;