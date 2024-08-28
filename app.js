const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewsSchema } = require("./schema");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const listings = require("./routes/listing");
const review = require("./routes/review");
const authentication = require("./routes/authentication");
const flash = require("connect-flash");

// Connect to MongoDB
main()
    .then(() => {
        console.log("connected");
    })
    .catch((err) => {
        console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlost');
}

// Set up view engine and static files
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Session and Passport setup
const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
};
// Routes
app.get("/", (req, res) => {
    res.send("working");
});

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req , res , next) => {
    res.locals.currUser = req.user;
    next();
});




app.use((req , res , next) => {
    res.locals.success = req.flash("success");
    res.locals.Delete = req.flash("Delete");
    next(); 

})
app.use("/listings" , listings);
app.use("/listings" , review);
app.use("/" , authentication);

// Sign up route


app.get("/res", (req, res) => {
    let { name = "unknown" } = req.query;
    req.session.name = name;
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    res.send(`hello ${req.session.name}`);
});

// Catch-all for unknown routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!!"));
});

// Global error handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong!!!" } = err;
    res.render("listings/error.ejs", { statusCode, message });
});

app.listen(2000, () => {
    console.log("running on 2000 port");
});
