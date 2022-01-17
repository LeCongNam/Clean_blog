const mongoose = require('mongoose')

async function connect() {
    try {
        let uri =`mongodb+srv://lecongnam:Vobichuyen0612@cluster0.j3gct.mongodb.net/clean_blog?retryWrites=true&w=majority`
        await mongoose.connect(uri)
        console.log("Connected to mongoose successfully");
    } catch (error) {
        console.log("Connect Failuse!!!",error)
    }
}

module.exports = {connect}