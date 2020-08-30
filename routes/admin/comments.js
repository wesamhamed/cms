const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");


router.get("/", (req, res) => {
    Comment.find({}).populate("user").then((comments) => {

        res.render("admin/comments", { comments: comments });
    })

})
router.post("/", (req, res) => {
    const { id, body } = req.body;
    Post.findById(id).then((post) => {

        const comment = new Comment({
            user: req.user._id,
            body
        });
        post.comments.push(comment);
        post.save().then((savedPost) => {
            comment.save().then((savedComment) => {
                req.flash("success_message", "Your comment will review in a second.")
                res.redirect(`/post/${post._id}`)
            })
        })
    })
})


router.delete("/:id", (req, res) => {
    const id = req.params.id;
    Comment.deleteOne({ _id: id }).then(() => {
        Post.findOneAndUpdate({ comments: id }, { $pull: { comments: id } }).then(() => {
            res.redirect("/admin/comments")
        })

    })
})

router.post("/approve-comment", (req, res) => {
    const { id, approveComment } = req.body;

    Comment.
    findByIdAndUpdate(id, { $set: { approveComment: approveComment } })
        .then((comment) => {
            res.send("it's work")

        })
})

module.exports = router;