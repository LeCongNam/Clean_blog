const express = require('express');
const router = express.Router();

const siteController = require('../controller/siteController')



// [GET] /details/:id
router.get('/details/:id', siteController.showDetails);

// [GET] /pagination
router.get('/pagination', siteController.homePagination);

// [GET] /pagination/:page
router.get('/pagination/:page', siteController.showPagePaginination);

// [GET] /create
router.get('/create', siteController.checkUserCreate, siteController.showCreate);

// [POST] /CREATE
router.post('/create', siteController.checkDataCreate, siteController.create);

// [GET] /listpost
router.get('/listpost', siteController.listPost);


// [GET] /delete/:id
router.get('/delete/:id', siteController.deletePost);

// [GET] /
router.get('/', siteController.home);


module.exports = router;
