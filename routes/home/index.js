const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Category = require("../../models/Category");
const User = require("../../models/User");
const Comment = require("../../models/Comment");
const { hashPassword, comparePassword } = require("../../helpers/encryptPassword");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const checkAuthentication = require("../../helpers/authentication");
const { isEmpty, uploadDir } = require("../../helpers/upload-helper");
const fs = require("fs");

router.all("/*", (req, res, next) => {
    req.app.locals.layout = "home";
    next();
});
router.get("/", async(req, res) => {

    const perPage = 10;
    const page = req.query.page || 1;
    const posts = await Post.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .populate("user");
    Post.countDocuments({}).then((postCount) => {
        Category.find({}).then((categories) => {
            res.render("home/index", {
                posts: posts,
                categories: categories,
                currentPage: parseInt(page),
                pagesCount: Math.ceil(postCount / perPage)
            })
        })
    })
});
router.get("/about", (req, res) => {
    res.render("home/about");
});
router.get("/services", (req, res) => {
    res.render("home/services");
});
router.get("/contact", (req, res) => {
    res.render("home/contact");
});

router.get("/login", (req, res) => {
    res.render("home/login");
});
passport.use(new LocalStrategy({ usernameField: "email" },
    (email, password, done) => {

        User.findOne({ email: email }, (err, user) => {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: "No user found" }); }
            if (!comparePassword(password, user.password)) { return done(null, false, { message: "Incorrect password" }); }
            return done(null, user);
        });
    }
))
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
router.post("/login", passport.authenticate('local', {
    failureRedirect: '/login',
    failureMessage: "Incorrect Login",
}), (req, res, next) => {

    res.redirect("/admin")
        // next();

});

router.get("/logout", (req, res) => {

    req.logout();
    res.redirect('/');
})
router.get("/register", (req, res) => {
    res.render("home/register");
});
router.post("/register", async(req, res) => {
    let { firstName, lastName, email, password, confirmPassword } = req.body;
    let errors = [];

    if (!req.body.firstName) {
        errors.push({ message: "Please add a firstName" });
    }
    if (!req.body.lastName) {
        errors.push({ message: "Please add a lastName" });
    }
    if (!req.body.email) {
        errors.push({ message: "Please add an email" });
    }
    if (!req.body.password) {
        errors.push({ message: "Please add a password" });
    }
    if (req.body.password == !req.body.confirmPassword) {
        errors.push({ message: "Please confirmPassword should match password" });
    }
    if (errors.length > 0) {
        res.render("home/register", { errors: errors })
    } else {
        User.findOne({ email: email }).then(async(user) => {
            if (user) {
                errors.push({ message: "You are exist" });
                res.render("home/register", { errors: errors });
            } else {
                let imageName = 'profile.jpg';

                if (!isEmpty(req.files)) {
                    let { image } = req.files;
                    imageName = Date.now() + "-" + image.name;
                    let dirUploads = "./public/uploads/";
                    image.mv(dirUploads + imageName, (err) => {
                        if (err) {
                            throw err;
                        }
                    });

                }
                password = await hashPassword(password);
                const user = new User({
                    firstName,
                    lastName,
                    email,
                    password,
                    image: imageName
                });
                user.save().then((saveUser) => {
                    req.flash("success_message", "You are now registered, please login")
                    res.redirect("/login");
                })
            }
        });
    }
});
router.get("/post/:id", (req, res) => {
    const id = req.params.id;
    Post.findById(id).populate([{
        path: "comments",
        model: Comment,
        match: { approveComment: true },
        populate: { path: "user", model: User }
    }, "user"]).then((post) => {
        Category.find({}).then((categories) => {
            const comments = post.comments;
            const user = post.user;
            // console.log(comments)
            res.render("home/post", { post: post, comments: comments, categories: categories, user: user })

        })
    })
})


router.post("/add/comments", (req, res) => {
    const { id, body } = req.body;
    Post.findById(id).then((post) => {

        const comment = new Comment({
            user: req.user._id,
            body
        });
        // console.log(comment);
        post.comments.push(comment);
        post.save().then((savedPost) => {
            comment.save().then((savedComment) => {
                req.flash("success_message", "Your comment will review in a second.")
                res.redirect(`/post/${post._id}`)
            })
        })
    })
})

module.exports = router;