const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");

main().then((res)=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const initDB = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data)
    .then((res)=>{
        console.log(res);
    }).catch((err)=>{
        console.log(err);
    });
};

initDB();
