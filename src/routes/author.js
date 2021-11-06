var express = require('express');
var router = express.Router();
const authorController = require('../controller/AuthorController')
const sanitizeHtml = require('sanitize-html');
const myPost = require('../model/post');

// [GET] /author/:author
router.post('/vote', authorController.startRatting);
router.get('/:author', authorController.listPost);
router.get('/edit/:id', authorController.showEdit);
router.post('/edit/:id', function (req, res, next) {
    myPost.findOne({ _id: req.params.id },
        (err, post) => {
            let a = req.body.content
            let imageFile;
            let uploadPath;

            let clean = sanitizeHtml(a, {
                disallowedTagsMode: 'discard'
            })
            req.body.content = clean;

            if (!req.files || Object.keys(req.files).length === 0) {
                post.author = req.body.author
                post.title = req.body.title
                post.subtitle = req.body.subtitle
                post.content = req.body.content
                return post.save(err => res.redirect('/'))
            }

            imageFile = req.files.image;
            uploadPath = 'src/public/img/' + imageFile.name;

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
            })
        })
})

router.post('/:heart', authorController.hearRatting);


module.exports = router;
