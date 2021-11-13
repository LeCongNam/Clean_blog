const express = require('express');
const router = express.Router();
const myPost = require('../model/post');
const siteController = require('../controller/siteController')

const sanitizeHtml = require('sanitize-html');

// [GET] /details/:id
router.get('/details/:id', siteController.showDetails);

// [GET] /pagination
router.get('/pagination', siteController.homePagination);

// [GET] /pagination/:page
router.get('/pagination/:page', siteController.showPagePaginination);

// [GET] /create
router.get('/create', siteController.checkUserCreate, siteController.showCreate);

// [POST] /CREATE
router.post('/create', siteController.checkDataCreate,  function(req, res, next) {
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
        uploadPath =  'src/public/img/'+imageFile.name;
       
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
    
});

// [GET] /listpost
router.get('/listpost', siteController.listPost);


// [GET] /delete/:id
router.get('/delete/:id', siteController.deletePost);

// [GET] /
router.get('/', siteController.home);


module.exports = router;
