module.exports.isLoggedIn = (req , res , next) => {
    if (!req.isAuthenticated()) {
        req.flash("Delete" , "Please First Login");
        return res.redirect('/login');
    }
    next();
}