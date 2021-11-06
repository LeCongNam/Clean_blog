const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
    author: { type: String , require},
    title: { type: String, require },
    subtitle: { type: String , require },
    content: { type: String },
    image: { type: String , require },
    heart: { type: Number, default:0 },
   star_1: { type: Number, default:0 },
   star_2: { type: Number, default:0 },
   star_3: { type: Number, default:0 },
   star_4: { type: Number, default:0 },
   star_5: { type: Number, default:0 },
}, { timestamps: true }
);

module.exports = mongoose.model('mypost', Post);