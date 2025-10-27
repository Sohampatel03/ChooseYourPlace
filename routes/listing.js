const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn} = require("../middleware");
const {isOwner , validateListing} = require("../middleware");



router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

router.get("/new", isLoggedIn,(req, res) => {
    res.render("listings/new.ejs");
});

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    id = id.replace(/:/g, "").trim();
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {path: "author",},
    }).populate("owner");
    res.render("listings/show.ejs", { listing });
}));

router.post("/", wrapAsync(async (req, res, next) => {
    let { title, image, country, location, price, description } = req.body;
    let listing = new Listing({
        title,
        description,
        price,
        location,
        country,
        image,
    });
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success" ,"Successfully Created");
    res.redirect("/listings");
}));

router.get("/:id/edit",  isLoggedIn,wrapAsync(async (req, res) => {
    let { id } = req.params;
    id = id.replace(/:/g, "").trim();
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));
//update route
router.put("/:id",isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body });
    req.flash("success" , "Successfully Updated");
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id", isLoggedIn,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedata = await Listing.findByIdAndDelete(id);
    console.log(deletedata);
    req.flash("Delete" , "Successfully Deleted");
    res.redirect("/listings");
}));  

module.exports = router;