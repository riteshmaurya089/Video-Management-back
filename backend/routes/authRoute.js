const express=require('express');
const { UserAuthModel } = require('../models/userAuthModel');
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { BlackListModule } = require('../models/blackListToken');
const userAuthRouter=express.Router()
require("dotenv").config()

userAuthRouter.post("/register",async(req,res)=>{
    const {userName,password}=req.body
    try {
        const user = await UserAuthModel.find({userName})
        if(user.length){
            res.status(400).send({ msg: "User is Already exists" })
        }else{
            bcrypt.hash(password, 2, async (err, hash) => {
                if (err) {
                  res.status(400).send({ err: err });
                } else {
                  const data = new UserAuthModel({  userName, password: hash });
                  await data.save();
                  res.status(200).send({ msg: "User Registration successfully" });
                }
              });

        }

    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }

})
userAuthRouter.post("/login",async(req,res)=>{
    const {userName,password}=req.body
    try {
        const user =await UserAuthModel.findOne({userName})
        console.log(user)
        if(user){
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                  const secretkey = process.env.SECRETKEY;
                  if (!secretkey) {
                    return res.status(500).send({ msg: "Secret key not defined" });
                  }
                  const token = jwt.sign(
                    { username:userName },
                    secretkey,
                    { expiresIn: "1hr" }
                  );
        
                  res.status(200).send({
                    msg: "Login successfull",
                    token: token,
                  });
                } else {
                  res.status(400).send({ err: "password does not match" });
                }
              });

        }else{
            res.status(500).json({ msg: "Internal server error" });
        }
        
    } catch (error) {
        
    }
})
userAuthRouter.post("/logout", async (req, res) => {
    try {
      const token = req.headers.authorization;
      jwt.verify(token, process.env.SECRETKEY, async (error, decode) => {
        if (error) {
          return res.status(400).json({ msg: "Invalid token" });
        }
        const isBlacklisted = await BlackListModule.findOne({ token });
  
        if (isBlacklisted) {
          return res
            .status(400)
            .json({ msg: "Token blacklisted, please log in again" });
        } else {
          await BlackListModule.create({ token });
  
          return res.status(200).json({ msg: "Logout Successfull." });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  });
module.exports={userAuthRouter}