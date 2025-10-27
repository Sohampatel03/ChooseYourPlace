const Listing = require("./models/listing");
const{reviewsSchema , listingSchema} = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl
        req.flash("Delete", "Please  Login First");
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}

module.exports.isOwner = async (req,res,next) => {
     let { id } = req.params;
         console.log(res.locals.currUser._id.toString());
         let listing  = await Listing.findById(id);
         if(!listing.owner.equals(res.locals.currUser._id.toString())){
             console.log("in listing updte");
             req.flash("Delete" , "You Don't have permission to edit this listing");
            return res.redirect(`/listings/${id}`);
         }
         next();
}

module.exports.validateReview = (req , res,next) =>{
    const { error } = reviewsSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
}

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if (error){
        let errMsg = error.map((el) => el.message);
        throw new ExpressError(404 , errMsg);
    }else{
        next();
    }
}
