const User = require('../model/user')
const bcrypt = require('bcrypt')


class UserController {

    // [GET] /login
    homeLogin(req, res, next) {
        req.session.userId = undefined
        res.redirect('/')
    }


    // [GET] /register
    pageRegister(req, res, next) {
        res.render('register');
    }

    // [POST] /register
    register(req, res, next) {
        const user = new User({ ...req.body });
        user.save()
            .then(() => res.redirect('/'))
            .catch(err => {
                if (err) return res.redirect('/users/register')
                res.redirect('/')
            })
    }

    // [GET] /login
    homeLogin(req, res, next) {
        res.render('login');
    }

    // [POST] /login
    login(req, res, next) {
        let { email, password } = req.body
        User.findOne({ email }, function (err, user) {
            if (user) {
                bcrypt.compare(password, user.password, (err, same) => {
                    if (same) {
                        req.session.userId = user._id
                        res.redirect('/')
                    } else {
                        res.redirect('/users/login')
                    }
                })
            } else {
                res.redirect('/users/login')
            }
        })
    }

    logout(req, res, next) {
        req.session.userId = undefined;
        res.redirect('/')
    }

    profile(req, res, next) {
        User.findById(req.session.userId, function (err, user) {
            res.render('profile', { user })
        })
    }

    follow(req, res, next) {
        User.findById(req.session.userId, function (err, user) {
            user.follow.push(req.body.follow)
            User.findOneAndUpdate({ _id: req.session.userId },{...user} , function (err, usr) {
                res.render('profile', { user })
            })
        })

    }

}

module.exports = new UserController();