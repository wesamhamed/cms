const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoryScheme = new Schema({
    name: {
        type: String,
        required: true
    }
});


const category = mongoose.model("Category", CategoryScheme);

module.exports = category;