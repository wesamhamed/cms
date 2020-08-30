// const express = require("express");
// const router = express.Router();
// const Post = require("../../models/Post");
// const Category = require("../../models/Category");
// const { isEmpty, uploadDir } = require("../../helpers/upload-helper");
// const fs = require("fs");
// const checkAuthentication = require("../../helpers/authentication");

// router.all("/*", checkAuthentication, (req, res, next) => {
//     if (req.user.isAdmin()) {
//         req.app.locals.layout = "admin";
//         next();
//     } else {
//         res.redirect("/")
//     }
// });


// router.get("/", (req, res) => {
//     Post.find({}).populate("category").then((posts) => {
//         res.render("admin/posts/index", { posts: posts });

//     })
// })



// router.get("/edit/:id", async(req, res) => {
//     const id = req.params.id;
//     const post = await Post.findById(id);
//     Category.find({}).then((categories) => {
//         res.render("admin/posts/edit", { post: post, categories: categories });

//     })

// });

// router.put("/edit/:id", (req, res) => {
//     const id = req.params.id;
//     let { title, status, allowComments, body, category } = req.body;
//     if (allowComments) {
//         allowComments = true;

//     } else {
//         allowComments = false;
//     }

//     Post.findById(id).then((post) => {
//         Post.updateOne({ _id: post._id }, { title, status, allowComments, body, category }, { new: true })
//             .then((post) => {
//                 req.flash("success_message", "Post was updated successfully");
//                 res.redirect("/admin/posts")

//             })
//     })

// });

// router.delete("/:id", (req, res) => {
//     const id = req.params.id;
//     Post.findById(id).then((post) => {
//         const file = post.file;
//         Post.deleteOne({ _id: id }).then(() => {
//             fs.unlink(uploadDir + file, (err) => {
//                 req.flash("success_message", `Post was deleted successfully`);
//                 res.redirect("/admin/posts")
//             })
//         })

//     })
// })
// module.exports = router;