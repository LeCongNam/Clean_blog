const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/clean_blog');
        console.log("Connected to mongoose successfully");
    } catch (error) {
        console.log("Connect Failuse!!!",error);
        
    }
}

module.exports = {connect};