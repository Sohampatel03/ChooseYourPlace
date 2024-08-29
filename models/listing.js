const mongoose  = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const user = require("./user");

const listingschema = new Schema({
    title :{
        type : String,
        required : true,
    },
    description : String , 
    image : {
        type : String,
        default : "https://images.pexels.com/photos/1212600/pexels-photo-1212600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        set : (v) => v === "" ? "https://images.pexels.com/photos/1212600/pexels-photo-1212600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" : v,
    },
    price : Number,
    location : String ,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",

        },
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "user",
    },
});

listingschema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
     
});


const Listing = mongoose.model("Listing",listingschema);
module.exports = Listing;