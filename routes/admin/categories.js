const express = require("express");
const router = express.Router();
const Category = require("../../models/Category");
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
    Category.find({}).then((categories) => {
        res.render("admin/categories/index", { categories });

    });
});
router.post("/create", (req, res) => {
    const { name } = req.body;
    const category = new Category({
        name: name
    });

    category.save().then(() => {

        res.redirect("/admin/categories");
    });
});
router.get("/edit/:id", (req, res) => {
    const id = req.params.id;
    Category.findById(id).then((category) => {
        res.render("admin/categories/edit", { category: category })
    });
})
router.put("/edit/:id", (req, res) => {
    const id = req.params.id;


    Category.findById(id).then((category) => {
        const { name } = req.body;
        Category.updateOne({ _id: id }, { name: name }, { new: true }).then((category) => {
            res.redirect("/admin/categories");
        });

    });
});
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    Category.deleteOne({ _id: id }).then(() => {
        res.redirect("/admin/categories");
    });
});
module.exports = router;