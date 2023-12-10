const asyncHandler=require('express-async-handler');
//middlware to check the token is  valid or not
const jwt=require('jsonwebtoken');
exports.validate=asyncHandler(async(req,res,next)=>{
    //using the cookie that we send while user login in our app
    const token=req.cookies.jwt;
    console.log("token",token,req.cookies);
        jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded)=>{
            if(err){
                return res.status(404);throw new Error("TokenExpired");
            }else{
            req.user=decoded.user;
            }});
        next();
        
});