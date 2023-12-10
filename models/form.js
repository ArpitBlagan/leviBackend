const mongoose=require('mongoose');
const form=mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userDB'
    },
    name:String,
    email:String,
    Address:String,
    pincode:String,
    gender:String,
    status:String,
    geolocation:String,
    country:String,
    state:String,
    files:[{name:String,path:String}]
});
module.exports=mongoose.model('formDB',form);