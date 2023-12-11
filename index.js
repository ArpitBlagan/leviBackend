const express=require('express');
const dotenv=require('dotenv').config();
const Router=require('./Router');
const multer=require('multer');const cors=require('cors');
const { error } = require('./middleware/error');
const fs = require('fs');
const cookieParser=require('cookie-parser');
const formDB=require('./models/form')
const app=express();
app.use(cookieParser());
app.use(cors({
  origin:['http://localhost:5173','*','https://marvelous-elf-35fcee.netlify.app','https://dapper-gumdrop-f07661.netlify.app'],
  credentials:true
}));const mongoose=require("mongoose");
const { validate } = require('./middleware/validate');
mongoose.connect(process.env.URL).then(con=>{console.log("connnected")});
app.use(express.json());
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './controller')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
const upload = multer({ storage });
app.post('/upload',validate,upload.array('files'),async(req,res)=>{
  const {name,state,latitude,longitude,country,pincode,address,email,gender,status}=req.body;
  let files=[];
  const user_id=req.user.id;
  req.files.map((ele,index)=>{
    console.log(ele.path);
    files.push({name:ele.originalname,path:ele.path})
    fs.unlink(ele.path,(err)=>{console.log("Error",err);})
  });
  const data=await formDB.create({user_id,name,state,email,latitude,longitude,country,pincode,address,gender,files});
  if(data){return res.status(202).json({message:"done"});}
  throw new Error("Not working");
});
app.use('/v1',Router);
app.use(error);
app.listen(process.env.PORT,()=>{
    console.log(`Listening on port ${process.env.PORT}...`);
});
