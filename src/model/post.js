const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
    author: { type: String , require},
    title: { type: String, require },
    subtitle: { type: String , require },
    content: { type: String },
    image: { type: String , require },
}, { timestamps: true }
);

module.exports = mongoose.model('mypost', Post);