const mongoose = require("mongoose");


url = "mongodb+srv://wesamhamed:0592280377@cluster0.pn4r0.mongodb.net/cms?retryWrites=true&w=majority"
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
const conn = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })


module.exports = conn;