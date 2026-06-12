const express = require("express");
const router = express.Router({mergeParams:true});

router.get("/signUp",(req,res)=>{
    res.render("../views/signUp.ejs");
});

router.post("/signUp",async(req,res)=>{
    let
});

module.exports= router;