const express=require("express");
const router=express.Router();
const User=require("../models/UserSchema")
const bcrypt=require("bcryptjs");

router.get('/',(req,res)=>{
    res.send("Hello from home page")
})

// Register

router.post('/register', async (req,res)=>{




const {name,email,phone,password}=req.body;

try{
const userExist=await User.findOne({email:email})

if(userExist){
        return res.status(422).json({error:"Email already exist"})
    }
    

    const user =new User({name,email,phone,password});

//   hashing

     await user.save()

    return res.status(201).json({message:"user registered successfully"}) 

}
catch(error)
{
    return res.status(500).json({error:"Some error occurred"})
}
})

// Login

router.post('/login',async (req,res)=>{
console.log("Inside login block")
    const {email,password}=req.body;
    try{
const userLogin= await User.findOne({email:email})

if(!userLogin){
    return res.status(400).json({error:"error occurred"})
}
else{
  
  const isMatch=await bcrypt.compare(password,userLogin.password);
  if(isMatch){
    return res.status(200).json({message:"Successfully registered"})
  }
  else{
    return res.status(400).json({error:"invalid Creditenal"})
  }
}
// console.log(userLogin);

    }
    catch(err){
console.log("In this block:"+err)
    }
})

module.exports=router;