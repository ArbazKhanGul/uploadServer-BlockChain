
// files
const express=require("express");
const app=express();
require("dotenv").config({path:"./src/config.env"});
require("./Database/databaseConnection");
const User=require("./models/UserSchema")

app.use(express.json());

const router=require("./Router/auth")

app.use(router);

app.listen(process.env.PORT,()=>{
    console.log("Listening at port number 3000")
})