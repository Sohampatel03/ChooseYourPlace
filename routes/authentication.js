const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");


router.get("/signup", (req, res) => {
    res.render("listings/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res , next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser , (err) => {
            if(err){
                return next(err)
            }
            res.redirect("/listings");
        })
       
    } catch (e) {
        res.send(e.message); 
    }
}));

// Login route
router.get("/login", (req, res) => {
    res.render("listings/login.ejs");
});

router.post("/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
    }),
    async (req, res) => {
        res.redirect("/listings");
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