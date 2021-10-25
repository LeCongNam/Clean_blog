const myPost = require('../model/post');
const sanitizeHtml = require('sanitize-html');

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

                myPost.find({})
                    .skip((currentPage - 1) * numberPost)
                    .limit(numberPost)
                    .then((posts) => {
                        res.render('index', { posts, currentPage, totalPost, lastPage });
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
        res.render('create_post');
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
    create(req, res, next) {
        let a = req.body.content
        let imageFile;
        let uploadPath;

        let clean = sanitizeHtml(a, {
            disallowedTagsMode: 'discard'
        })
        req.body.content = clean;

        // handle file upload
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        } else if (!req.files.image.mimetype.includes('image')) {
            return res.status(422).send('File extension error');
        }

        imageFile = req.files.image;
        uploadPath = 'public/img/' + imageFile.name;
        imageFile.mv(uploadPath, function (err) {
            if (err) return res.status(500).send(err);
            // save data 
            const posts = new myPost({
                author: req.body.author,
                title: req.body.title,
                subtitle: req.body.subtitle,
                content: req.body.content,
                image: imageFile.name,
            })

            posts.save()
                .then(() => res.redirect('/'))
                .catch((err) => console.log(err))
        });
    }


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
                res.render('details', { posts });
            })
            .catch((err) => console.log(err))
    }

    // [GET] /pagination
    homePagination(req, res, next) {
        res.redirect('/pagination/1');
    }

    // [GET] /listpost
    listPost (req, res, next) {
        myPost.find({})
            .then((posts) => {
                res.render('listpost', { posts });
            })
            .catch((err) => console.log(err))
    }

    // [GET] /delete/:page
    deletePost (req, res, next) {
        myPost.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('/listpost'))
    }
}

module.exports = new SiteController();