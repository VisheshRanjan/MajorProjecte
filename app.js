const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
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

// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"Cilian Villa",
//         description:"BEside the Beach ",
//         price: 73400,
//         location:"Coimbatore"
//     });



//     await sampleListing.save().then((res)=>{
//         console.log(res);
//     }).then((err)=>{
//         console.log(err);
//     });




// })

app.get("/listings", wrapAsync(async (req,res)=>{
   let allList = await Listing.find({})
    res.render("../views/listings/index.ejs",{allList});

    // res.send("GET is working go ahead !");
}));

app.get("/listings/new",(req,res)=>{
    res.render("newListing.ejs");
    // console.log("CREATE GET is working !");
});

app.post("/listings/new", wrapAsync( async (req,res,next)=>{
    let{newTitle,newDescription,newUrl,newPrice,newLocation,newCountry} = req.body;
   await Listing.create({
        title:newTitle,
        description:newDescription,
        image:{url:newUrl},
        price:newPrice,
        location:newLocation,
        country:newCountry
    });

    res.redirect("/listings");

    // res.send("POST is WORKING FOR new LISTING!!!");
}));

app.get("/listings/:_id/edit", wrapAsync(async (req,res)=>{
    let{_id} = req.params;
    let user = await Listing.findById(_id);
    res.render("edit.ejs",{user});
    // res.send("GET is WORKING, Go for EJS !!");
}));

app.put("/listings/:_id/edit", wrapAsync(async(req,res)=>{
    let{_id} = req.params;
        const newInfo =req.body.edit;
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

app.get("/listings/:_id", wrapAsync(async (req,res)=>{
    let {_id} = req.params;
    let allList = await Listing.findById(_id);
    console.log(allList);
    res.render("../views/listings/show.ejs",{allList});
    // res.send(listInfo);
    // res.redirect("/listings");

}));

app.use((req,res,next)=>{
    next(new expressError(404,"Page Not Found"))
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message} = err;
    res.status(statusCode).send(message);
});




// res.send("GET WORKING!!!");
