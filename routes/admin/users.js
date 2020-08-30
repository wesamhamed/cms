const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { uploadDir } = require("../../helpers/upload-helper");
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
    User.find({ role: "user" }).then((users) => {
        res.render("admin/users/index", { users: users });

    })
})



router.delete("/:id", (req, res) => {
    const id = req.params.id;
    User.findById(id).then((user) => {
        const image = user.image;
        User.deleteOne({ _id: id }).then(() => {

            fs.unlink(uploadDir + file, (err) => {
                req.flash("success_message", `User was deleted successfully`);
                res.redirect("/admin/users")
            })
        })

    })
})
module.exports = router;