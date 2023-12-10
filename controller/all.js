const asyncHandler=require('express-async-handler');
const userDB =require('../models/user');
const formDB=require('../models/form');
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs');
exports.getData=asyncHandler(async(req,res)=>{
    const user_id=req.user_id;
    const data=await formDB.find({user_id});
    if(data){
        console.log("data",data);
        return res.status(202).json(data);
    }
    return res.status(404).json({message:"Something went wrong"})
})
exports.register=asyncHandler(async(req,res)=>{
    //to register the use 
    const {name,email,password}=req.body;
    //check the fields
    if(!name||!email||!password){
        res.status(400);throw new Error("All fields require");
    }
    // if the email is used before it is no valid
    const val=await userDB.findOne({email});
    if(val){
        res.status(400);throw new Error("This email is already registered");
    }
    //crypt the password for safety
    const hash=await bcrypt.hash(password,10);
    //create new use in DB
    const data=await userDB.create({name,email,password:hash});
    if(data){
    res.status(200).json({"message":"created"});}
    else{
        res.status(404);throw new Error("Something went wrong the fields");}
})
exports.login=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    console.log(email,password);
    //check fields for login
    if(!email||!password){
        res.status(400);throw new Error("All fields require");
    }
    //find if there is any user in DB with the this email
    const user=await userDB.findOne({email});
    console.log("user",user);
    if(user&&(bcrypt.compare(password,user.password))){
        const token= jwt.sign({
            user:{
                id:user._id,
                email:user.email,
                name:user.name
            }
        },process.env.ACCESS_TOKEN,{expiresIn:"30m"});
        //send it to user through cookies
        res.cookie("jwt",token,{
            //30 days in milisecond
            httpOnly:true,
            expires:new  Date(Date.now()+(30*24*60*60*1000)),
            sameSite: 'none',
            secure:true
        });
        return res.status(200).json({message:"Logged In"});
    }
    res.status(400).json({message:"Something Went Wrong"})
})