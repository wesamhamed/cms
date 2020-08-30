const mongoose = require("mongoose");
const user = require("./User");
const Schema = mongoose.Schema;

const CommentScheme = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    approveComment: {
        type: Boolean,
        default: false
    }

});

const comment = mongoose.model("Comment", CommentScheme);

module.exports = comment;