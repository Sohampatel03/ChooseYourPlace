const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const User = require("../models/user");


router.get("/signup", (req, res) => {
    res.render("listings/signup.ejs");
});

router.post("/signup", saveRedirectUrl ,wrapAsync(async (req, res , next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser , (err) => {
            if(err){
                return next(err)
            }
        })
        req.flash("success" , "Welcome to ChooseYourPlace");
        res.redirect(res.locals.redirectUrl || "/listings");
    } catch (e) {
        req.flash("Delete", e.message);
        res.redirect("/signup") ;
    }
}));

// Login route
router.get("/login", (req, res) => {
    res.render("listings/login.ejs");
});

router.post("/login", saveRedirectUrl ,
    passport.authenticate("local", {
        failureRedirect: "/login",
    }),
    async (req, res) => {
        req.flash("success" , "Welcome back to ChooseYourPlace");
        res.redirect(res.locals.redirectUrl || "/listings");
    }
);

router.get("/logout", (req , res , next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        console.log("logout")
        res.redirect('/listings');
    })

});

module.exports = router;