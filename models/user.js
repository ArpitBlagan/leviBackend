const mongoose=require('mongoose');
const user=mongoose.Schema({
    name:String,
    email:String,
    password:String
});
module.exports=mongoose.model('userDB',user);