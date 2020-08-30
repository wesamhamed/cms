const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const urlSlug = require("mongoose-url-slugs");

const PostScheme = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "public"
    },
    allowComments: {
        type: Boolean,
        required: true,
    },
    body: {
        type: String,
        required: true
    },
    file: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    slug: {
        type: String
    }
}, { usePushEach: true });

PostScheme.plugin(urlSlug("title", { field: "slug" }))
const post = mongoose.model("Post", PostScheme);

module.exports = post;