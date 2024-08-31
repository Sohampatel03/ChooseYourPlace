
const mongoose  = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMangoose = require("passport-local-mongoose");

const userSchema = new Schema({
    username :{
        type : String,
        required : true,

    },
});


userSchema.plugin(passportLocalMangoose);

module.exports = mongoose.model('User', userSchema);     
