const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");

// Create Review Route
router.post("/:id/review", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let id = req.params.id;
    // Create new review with explicit author assignment
    let newReview = new Review({
        comment: req.body.comment,
        rating: req.body.rating,
        author: req.user._id
    });
    
    // Debug: Check review before saving
    console.log("New Review before save:", newReview.author);
    
    await newReview.save();
    
    // Debug: Check review after saving
    console.log("New Review after save:", newReview.author);
    
    listing.reviews.push(newReview._id);
    await listing.save();
    
    req.flash("success", "Review Successfully Added");
    res.redirect(`/listings/${id}`);
}));

// Delete Review Route
router.delete("/:id/review/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    
    // Remove review reference from listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    
    // Delete the review
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("Delete", "Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;