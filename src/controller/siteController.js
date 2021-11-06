const myPost = require('../model/post');
const sanitizeHtml = require('sanitize-html');
const path = require('path')
const User = require('../model/user')

class SiteController {

    home(req, res, next) {
        let currentPage = req.query.page || 1;
        let numberPost = 5;
        let totalPost;

        myPost.find({})
            .countDocuments()
            .then(count => {
                totalPost = count;
                const lastPage = Math.ceil(totalPost / numberPost);
                let useName;

                if (req.session.userId) {
                    User.find({ _id: req.session.userId })
                        .then((users) => {
                            useName = users[0].username;
                        })
                }

                myPost.find({})
                    .skip((currentPage - 1) * numberPost)
                    .limit(numberPost)
                    .then((posts) => {
                        res.render('index', { posts, currentPage, totalPost, lastPage, useName });
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    //[GET] /create | midleware
    checkUserCreate(req, res, next) {
        if (typeof req.session.userId == 'undefined') return res.redirect('/users/login')
        next()
    }

    //[GET] /create
    showCreate(req, res, next) {
        User.findById(req.session.userId, function (err, usr) {
            let { username } = usr
            res.render('create_post', { username });

        })

    }

    //[POST] /create
    checkDataCreate(req, res, next) {
        const content = req.body.content
        const title = req.body.title
        const subtitle = req.body.subtitle
        const author = req.body.author
        if (content === '' || title === '' || subtitle === '' || author === '') {
            return res.redirect('back')
        } else if (!req.files || Object.keys(req.files).length === 0) {
            return res.redirect('back')
        }
        next()
    }

    //[POST] /create
    showPagePaginination(req, res, next) {
        let page = req.params.page || 1;
        let numPage = 3;
        myPost
            .find({})
            .skip((page * numPage) - numPage)
            .limit(numPage)
            .exec((err, allPost) => {
                myPost.countDocuments((err, count) => {
                    if (err) return next(err);
                    res.render('pagination', {
                        allPost, //all post
                        currentPage: page, //page hiện tại
                        pages: Math.ceil(count / numPage)
                    });
                })
            })
    }


    // [GET] /details/:id
    showDetails(req, res, next) {
        myPost.findById({ _id: req.params.id })
            .then((posts) => {
                let toltalStart = posts.star_1 * 1 + posts.star_2 * 2 + posts.star_3 * 3 + posts.star_4 * 4 + posts.star_5 * 5
                let totalVote = posts.star_1 + posts.star_2 + posts.star_3 + posts.star_4 + posts.star_5
                let totalStart = isFinite((toltalStart) / (totalVote)) ? ((toltalStart) / (totalVote)).toFixed(1) : 0

                res.render('details', { posts, totalStart });
            })
            .catch((err) => console.log(err))
    }

    // [GET] /pagination
    homePagination(req, res, next) {
        res.redirect('/pagination/1');
    }

    // [GET] /listpost
    listPost(req, res, next) {

        User.findById(req.session.userId, function (err, usr) {
            var name

            for (let key in usr) {
                if (key == 'username') {
                    name = usr[key]
                }
            }
            console.log(name)
            myPost.find({ author: {$regex: name, $options:'i'}})
                .then((posts) => {
                    console.log(posts)
                    res.render('listpost', { posts });
                })
                .catch((err) => console.log(err))
        })
    }

    // [GET] /delete/:page
    deletePost(req, res, next) {
        myPost.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('/listpost'))
    }
}

module.exports = new SiteController();