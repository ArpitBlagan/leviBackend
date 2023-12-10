const express=require('express');
const { register, login, getData } = require('./controller/all');
const { validate } = require('./middleware/validate');
const Router=express.Router();
Router.route('/register').post(register);
Router.route('/login').post(login);
Router.use(validate);
Router.route('/all').get(getData);
module.exports=Router;