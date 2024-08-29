const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then((res) => {
    console.log("connected");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlost')
}   




const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj , owner : "66cf11a53f835e061ba63419"}));
     await Listing.insertMany(initData.data);

}
initDB();
