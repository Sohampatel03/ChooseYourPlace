const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {  // Fixed typo: was "createAt"
        type: Date,
        default: Date.now,  // Fixed: removed () from Date.now
    },
    author: {  // ADDED: This field was missing
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Review", reviewSchema);