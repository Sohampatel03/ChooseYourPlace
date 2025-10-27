const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const {validateReview, isLoggedIn} = require("../middleware");

// Create Review Route
router.post("/:id/review", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let id = req.params.id;
    
    // Create new review
    let newReview = new Review(req.body);
    newReview.author = req.user._id;
    
    // FIXED: Uncommented these critical lines
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    
    console.log(newReview);
    req.flash("success", "Review Successfully Added");
    res.redirect(`/listings/${id}`);
}));

// Delete Review Route
router.delete("/:id/review/:reviewId", isLoggedIn, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    
    // Remove review reference from listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    
    // Delete the review
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("Delete", "Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;