const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.use(express.static(path.join(__dirname, "public")));
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");




app.engine("ejs", ejsMate);
app.set("view engine", "ejs");


main().then((res)=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};


app.listen(8080,(req,res)=>{
    console.log("App is Listening");
});

app.get("/",(req,res)=>{
    res.send("Root is working !");
});


const validateSchema=(req,res,next)=>{
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new expressError(400, error.message);
    } else{
        next();
    }
};

const validateReview=(req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new expressError(400, error.message);
    } else{
        next();
    }
};

app.get("/listings", wrapAsync(async (req,res)=>{
   let allList = await Listing.find({})
    res.render("../views/listings/index.ejs",{allList});

    // res.send("GET is working go ahead !");
}));

app.get("/listings/new",(req,res)=>{
    res.render("newListing.ejs");
    // console.log("CREATE GET is working !");
});

app.post("/listings/new", validateSchema, wrapAsync( async (req,res,next)=>{

    let newListing = new Listing(req.body.listing);
    
    await newListing.save();
        res.redirect("/listings");
 // res.send("POST is WORKING FOR new LISTING!!!");
}));

app.get("/listings/:_id/edit", wrapAsync(async (req,res)=>{
    let{_id} = req.params;
    let user = await Listing.findById(_id);
    res.render("edit.ejs",{user});
    // res.send("GET is WORKING, Go for EJS !!");
}));

app.put("/listings/:_id/edit",validateSchema, wrapAsync(async(req,res)=>{
    let{_id} = req.params;
        const newInfo =req.body.listing;
        console.log(newInfo);
        await Listing.findByIdAndUpdate(_id,newInfo);
    res.redirect("/listings");

    // res.send("Keep building!");
}));

app.post("/listings/:_id/delete", wrapAsync(async (req,res)=>{
    let{_id} =req.params;
    let delUser = await Listing.findByIdAndDelete(_id);
    console.log(delUser);

    res.redirect("/listings");
}));

app.post("/listings/:_id/reviews",validateReview,wrapAsync(async (req,res)=>{
        let {_id} = req.params;
    let listing = await Listing.findById(_id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    // console.log("SAved");
    res.redirect("/listings");
}));

app.get("/listings/:_id", wrapAsync(async (req,res)=>{
    let {_id} = req.params;
    let allList = await Listing.findById(_id).populate("reviews");
    console.log(allList);
    res.render("../views/listings/show.ejs",{allList});
    // res.send(listInfo);
    // res.redirect("/listings");

}));

app.delete("/listings/:_id/reviews/:reviewId/delete",wrapAsync(async(req,res,next)=>{
    let{_id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(_id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${_id}`);

}));

app.use((req,res,next)=>{
    next(new expressError(404,"Page Not Found"))
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message} = err;
    res.status(statusCode).render("error.ejs",{err});
});




// res.send("GET WORKING!!!");
