const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const handlebars = require("handlebars");
const expreshbs = require("express-handlebars");
const upload = require("express-fileupload");
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const { select, getTime, ifCond, paginate } = require("./helpers/handlebars-helpers");
const conn = require("./config/database");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const { authenticate } = require("passport");
const authentication = require("./helpers/authentication");


const homeRouter = require("./routes/home/index");
const adminRouter = require("./routes/admin/index");
const postsRouter = require("./routes/admin/posts");
const categoriesRouter = require("./routes/admin/categories");
const commentsRouter = require("./routes/admin/comments");
const usersRouter = require("./routes/admin/users");

const PORT = process.env.PORT || 3000;
const app = express();

conn.then((db) => {
    console.log("database connected")
});

app.use(upload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
    secret: "wesamhamed",
    resave: true,
    saveUninitialized: true
}));

app.use(flash());
app.use((req, res, next) => {
    res.locals.user = req.user || null;

    res.locals.error = req.flash("error");
    res.locals.success_message = req.flash("success_message");
    next();
})

app.use(express.static(path.join(__dirname, "public")));
app.engine("handlebars", expreshbs({ handlebars: allowInsecurePrototypeAccess(handlebars), defaultLayout: "home", helpers: { select, getTime, ifCond, paginate } }));
app.set("view engine", "handlebars");
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.isLogin = !!req.user;
    // console.log("isLogin " + app.locals.isLogin)
    app.locals.isAdmin = (req.user == undefined ? false : req.user.isAdmin());
    // console.log("isAdmin " + app.locals.isAdmin);
    next();

})
app.use("/", homeRouter);
app.use("/admin", adminRouter);
app.use("/admin/posts", postsRouter);
app.use("/admin/categories", categoriesRouter);
app.use("/admin/comments", commentsRouter);
app.use("/admin/users", usersRouter);

app.use((err, req, res, next) => {
    if (err) {
        console.error(err);
        // process.exit(0);
    } else {
        next();
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} `)
});