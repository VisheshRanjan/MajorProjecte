const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const passport = require("passport");

router.get("/signUp",(req,res)=>{
    res.render("../views/signUp.ejs");
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

module.exports= router;