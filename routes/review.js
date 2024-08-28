const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");



const validateReview = (req, res, next) => {
    const { error } = reviewsSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
};

router.post("/:id/review", wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let id = req.params.id;
    let newReview = new Review({
        comment: req.body.comment,
        rating: req.body.rating,
    });

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review save");
    req.flash("success" , "Review Successfully Added");
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id/review/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    if (!req.isAuthenticated()) {
        return res.redirect('/signup');
    }
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("Delete" , "Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
