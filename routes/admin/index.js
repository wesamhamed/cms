const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Category = require("../../models/Category");
const User = require("../../models/User");
const Comment = require("../../models/Comment");
const faker = require("faker");
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
    Post.countDocuments({}).then(async(postsCount) => {
        const categoriesCount = await Category.countDocuments({});
        const commentsCount = await Comment.countDocuments({});
        const usersCount = await User.countDocuments({});
        res.render("admin/index", { postsCount, categoriesCount, commentsCount, usersCount });

    })
});

router.post("/generate-fake-posts", (req, res) => {
    const amount = +req.body.amount;
    for (let i = 0; i < amount; i++) {
        let title = faker.name.title();
        let slug = faker.name.title();
        let status = "public";
        let allowComments = faker.random.boolean();
        let body = faker.lorem.sentence();
        let file = "BMW-Z4.jpg";
        let user = req.user._id;
        let post = new Post({ title, user, file, slug, status, allowComments, body });
        post.save().then((savedPost) => {

        })
    }
    res.redirect("/admin/posts")
})
module.exports = router;