const mongoose = require("mongoose");
const { ref } = require("../schema");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type: String,
        required:true,
    },
    description:String,
    image:{
        filename:{
            type:String,
            default:"listingimage",
        },
        url:{
            type:String,
            default:"https://unsplash.com/photos/cozy-armchair-coffee-and-cake-in-a-warm-inviting-room-iL9Ucm18HCE",
        },
    },
    price:{
        type : Number,
        required :true,
    },
    location:{
        type:String,

    },
    country:{ type:String
}, 
	reviews: [
            {
                type:Schema.Types.ObjectId,
                ref:"Review"
            }
        ]
	});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
