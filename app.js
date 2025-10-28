require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const listings = require("./routes/listing");
const review = require("./routes/review");
const authentication = require("./routes/authentication");
const flash = require("connect-flash");

// -----------------------
// ✅ MongoDB Connection
// -----------------------
async function main() {
    await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
}
main()
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.log(err));

// -----------------------
// ✅ View Engine + Middleware Setup
// -----------------------
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// -----------------------
// ✅ Session & Passport Setup
// -----------------------
const sessionOptions = {
    secret: process.env.SECRET || "fallbacksecret",
    resave: false,
    saveUninitialized: false, // 🔹 better security practice
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// Prevent browser caching for authenticated pages
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// -----------------------
// ✅ Locals Middleware (for every EJS render)
// -----------------------
app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.Delete = req.flash("Delete");
    next();
});

// -----------------------
// ✅ Routes
// -----------------------
app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/listings", listings);
app.use("/listings", review);
app.use("/", authentication);


// -----------------------
// ✅ Catch-all route (404)
// -----------------------
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!!"));
});

// -----------------------
// ✅ Global Error Handler
// -----------------------
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something Went Wrong!!!" } = err;
    res.render("listings/error.ejs", { statusCode, message });
});

// -----------------------
// ✅ Server Start
// -----------------------
app.listen(process.env.PORT || 2000, () => {
    console.log("🚀 Server running on port 2000");
});
