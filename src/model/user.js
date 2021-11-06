const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const User = mongoose.Schema({
    username: { type: String , require},
    email: { type: String, require, unique:true },
    password: { type: String , require },
    follow: { type: Array , default:[] },
}, { timestamps: true }
);

User.pre('save', function (next) {
    let user = this;
    bcrypt.hash(user.password, 10, function (err, encrypted) {
      user.password = encrypted
      next()
    })
 })

module.exports = mongoose.model('user', User);