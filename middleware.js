module.exports.isLogin =(req,res,next)=>{       
    if(!req.isAuthenticated()){
        req.flash("error","Log-In First ");
        return res.redirect("/login");
    }
    next();
}