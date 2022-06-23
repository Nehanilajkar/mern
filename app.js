//jshint esversion:6

require('dotenv').config()
const express=require('express');
const ejs=require('ejs');
const bodyparser=require('body-parser');
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption');

const app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine', 'ejs')
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/credentialDB');
const userSchema=new mongoose.Schema({
 name:String,
 password:String
});

// secret must be befor model
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const Credential=new mongoose.model("Credential",userSchema);

app.get("/",function(req,res){
 res.render("home");
});

app.get("/register",function(req,res){
 res.render("register");
});

app.get("/login",function(req,res){
 res.render("login");
});

app.post("/register",function(req,res){
 const username=req.body.username;
 const password=req.body.password;
   const credential=new Credential({
    name:username,
    password:password
   });
   credential.save(function(err){
     if (!err){console.log("Successfully saved.");}
     else{console.log(err);}
   });
   res.redirect("/");
});

app.post("/login",function(req,res){
 const username=req.body.username;
 const password=req.body.password;

 Credential.findOne({name:username},function(err,user){
  if (!err){
   if (password===user.password){
    res.render("secrets");
   }
  }
 });
});

app.listen(5551,function(){
 console.log("Server started on 5551");
});