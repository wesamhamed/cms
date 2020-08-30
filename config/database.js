const mongoose = require("mongoose");
const { mongoDbUrlDevelopment } = require("./dev-database");
const { mongoDbUrl } = require("./prod-database");

if (process.env.NODE_ENV == "production") {
    url = mongoDbUrl;
} else {
    url = mongoDbUrlDevelopment;
}
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
const conn = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })


module.exports = conn;