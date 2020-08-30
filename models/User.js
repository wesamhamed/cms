const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserScheme = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    image: {
        type: String,

    }

    // posts: [{
    //     type: Schema.Types.ObjectId,
    //     ref: "Post"
    // }]
});


UserScheme.methods.isAdmin = function() {
    return this.role === "admin";
}
const user = mongoose.model("User", UserScheme);
module.exports = user;