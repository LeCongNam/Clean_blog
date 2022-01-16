const mongoose = require('mongoose')

async function connect() {
    try {
        await mongoose.connect(`mongodb+srv://lecongnam:Vobichuyen0612@cluster0.j3gct.mongodb.net/${clean_blog}?retryWrites=true&w=majority`)
        console.log("Connected to mongoose successfully")
    } catch (error) {
        console.log("Connect Failuse!!!",error)
    }
}

module.exports = {connect}