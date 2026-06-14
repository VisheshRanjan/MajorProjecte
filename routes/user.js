const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const passport = require("passport");

router.get("/signUp",(req,res)=>{
    res.render("../views/users/signUp.ejs");
});

router.post("/signUp",async(req,res)=>{
    try {
        let {username, email, password} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        res.redirect("/listings");
    } catch (e) {
        console.error(e);
        res.redirect("/signUp");
    }
});

router.get("/login",(req,res)=>{
    res.render("../views/users/login.ejs");
});

router.post("/login",passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),(req,res)=>{
    try{
        req.flash("success","You're Logged in ..");
req.session.success = "Welcome to Wanderlust";
res.redirect("/listings");
    }catch(error){
                console.log("The prob is :");

        console.log(error);
    };

});

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect("listings");
  });
});

module.exports= router;