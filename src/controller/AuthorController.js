const myPost = require('../model/post')
const sanitizeHtml = require('sanitize-html')
const path = require('path')
const User = require('../model/user')


class AuthorController {

    listPost(req, res, next) {
        let currentPage = req.query.page || 1
        let numberPost = 5;
        let totalPost;

        myPost.find({author: {$regex:req.params.author,$options:'i'}})
            .countDocuments()
            .then(count => {
                totalPost = count;
                const lastPage = Math.ceil(totalPost / numberPost)
                myPost.find({author: {$regex:req.params.author,$options:'i'}})
                    .skip((currentPage - 1) * numberPost)
                    .limit(numberPost)
                    .then((posts) => {
                        res.render('list_post_author', {posts, currentPage, totalPost, lastPage})
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    hearRatting(req, res, next) {
        let infoPost = {}
        myPost.find({_id: req.body.idpost})
            .then(posts => {
                posts[0].heart = posts[0].heart + 1
                myPost.findOneAndUpdate({_id: req.body.idpost}, {heart: posts[0].heart}, '', function () {
                    res.redirect('back')
                })
            })
    }


    startRatting(req, res, next) {

        var starname = `star_${req.body.totalStar}`
        myPost.find({_id: req.body.idpost})
            .then(posts => {
                let obj = JSON.parse(JSON.stringify(posts[0]))
                obj[starname] = obj[starname] + 1;
                myPost.findOneAndUpdate({_id: req.body.idpost}, obj, function () {
                    res.redirect('back')
                })
            })
    }

    showEdit(req, res, next) {
        myPost.findById(req.params.id)
            .then((post) => {
                res.render('edit', {post})
            })
            .catch((err) => console.log(err))
    }


}

module.exports = new AuthorController()