const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");


router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

router.get("/new", (req, res) => {
    console.log(req.isAuthenticated ? "isAuthenticated exists" : "isAuthenticated missing");
    if (!req.isAuthenticated()) {
        return res.redirect('/signup');
    }
    res.render("listings/new.ejs");
});

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    id = id.replace(/:/g, "").trim();
    const listing = await Listing.findById(id).populate("reviews");
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

    await listing.save();
    res.redirect("/listings");
}));

router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    id = id.replace(/:/g, "").trim();
    const listing = await Listing.findById(id);
    if (!req.isAuthenticated()) {
        return res.redirect('/signup');
    }
    res.render("listings/edit.ejs", { listing });
}));

router.put("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(req.body);
    await Listing.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    if (!req.isAuthenticated()) {
        return res.redirect('/signup');
    }
    let deletedata = await Listing.findByIdAndDelete(id);
    console.log(deletedata);

    res.redirect("/listings");
}));  

module.exports = router;