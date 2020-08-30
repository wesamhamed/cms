const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Category = require("../../models/Category");
const { isEmpty, uploadDir } = require("../../helpers/upload-helper");
const fs = require("fs");
const checkAuthentication = require("../../helpers/authentication");

router.all("/*", checkAuthentication, (req, res, next) => {
    if (req.user.isAdmin()) {
        req.app.locals.layout = "admin";
        next();
    } else {
        res.redirect("/")
    }
});


router.get("/", (req, res) => {
    Post.find({}).populate("category").then((posts) => {

        res.render("admin/posts/index", { posts: posts });

    })
})

router.get("/my-posts", (req, res) => {
    const id = req.user._id;
    Post.find({ user: id }).populate("category").then((posts) => {

        res.render("admin/posts/my-posts", { posts: posts });

    })
})
router.get("/create", (req, res) => {

    Category.find({}).then((categories) => {
        res.render("admin/posts/create", { categories: categories });

    });
});
router.post("/create", (req, res) => {
    let errors = [];
    let id = req.user._id;
    if (!req.body.title) {
        errors.push({ message: "Please add a title" });
    }
    if (!req.body.status) {
        errors.push({ message: "Please add a status" });
    }
    if (!req.body.allowComments) {
        errors.push({ message: "Please check allowComments" });
    }
    if (!req.body.body) {
        errors.push({ message: "Please add a body" });
    }
    if (!req.body.category) {
        errors.push({ message: "Please add a category" });
    }
    if (errors.length > 0) {
        res.render("admin/posts/create", { errors: errors })
    } else {
        let filename = 'BMW-Z4.jpg';
        if (!isEmpty(req.files)) {
            let { file } = req.files;
            filename = Date.now() + "-" + file.name;
            let dirUploads = "./public/uploads/";
            file.mv(dirUploads + filename, (err) => {
                if (err) {
                    throw err;
                }
            });

        }
        let { title, status, allowComments, body, category } = req.body;
        if (allowComments) {
            allowComments = true;
        } else {
            allowComments = false;
        }
        const post = new Post({
            title,
            status,
            allowComments,
            body,
            file: filename,
            category,
            user: id
        });
        post.save().then((savedPost) => {
            // console.log(savedPost);
            req.flash("success_message", `Post ${savedPost.title} created successfully`);
            res.redirect("/admin/posts");

        }).catch((validator) => {
            res.redirect("/admin/posts", { errors: validator.errors });

        });
    }
});

router.get("/edit/:id", async(req, res) => {
    const id = req.params.id;
    const post = await Post.findById(id);
    Category.find({}).then((categories) => {
        res.render("admin/posts/edit", { post: post, categories: categories });

    })

});

router.put("/edit/:id", (req, res) => {
    const id = req.params.id;
    let { title, status, allowComments, body, category } = req.body;
    if (allowComments) {
        allowComments = true;

    } else {
        allowComments = false;
    }

    Post.findById(id).then((post) => {
        Post.updateOne({ _id: post._id }, { title, status, allowComments, body, category }, { new: true })
            .then((post) => {
                req.flash("success_message", "Post was updated successfully");
                res.redirect("/admin/posts")

            })
    })

});

router.delete("/:id", (req, res) => {
    const id = req.params.id;
    Post.findById(id).populate("comments").then((post) => {
        const file = post.file;
        if (!post.comments.length < 1) {
            post.comments.forEach((comment) => {
                comment.deleteOne();
            })
        }
        Post.deleteOne({ _id: id }).then(() => {
            if (file !== "BMW-Z4.jpg") {
                fs.unlink(uploadDir + file, (err) => {
                    req.flash("success_message", `Post was deleted successfully`);
                    res.redirect("/admin/posts")
                })
            }
        })

    })
})
module.exports = router;