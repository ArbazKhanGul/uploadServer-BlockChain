const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../Middleware/authenticate");
const Web3 = require("web3");
const form=require("../models/FormSchema");
router.get("/", (req, res) => {
  res.send("Hello from home page");
});


// Register

router.post("/registeration", async (req, res) => {
  const { firstname, lastname, email, phone, password } = req.body;

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({
        stat: "wrong",
        error: "Email already exist",
      });
    }

    const user = new User({ firstname, lastname, email, phone, password });

    //   hashing

    await user.save();

    return res.status(201).json({
      stat: "success",
      message: "user registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      stat: "wrong",
      error: "Some error occurred",
    });
  }
});

// Login

router.post("/login", async (req, res) => {

  const { email, password } = req.body;
  try {
    const userLogin = await User.findOne({ email: email });

    if (!userLogin) {
      return res.status(400).json({
        stat: "wrong",
        error: "invalid Creditenal",
      });
    } else {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      if (isMatch) {
        const token = await userLogin.generateAuthToken();
        res.cookie("jwttoken", token, {
          httpOnly: true,
          // domain: process.env.CLIENT_DOMAIN
        });

        return res.status(200).json({
          stat: "success",
          message: "Successfully login",
        });
      } else {
        return res
          .status(400)
          .json({ stat: "wrong", error: "invalid Creditenal" });
      }
    }
  } catch (err) {
    console.log("In this block:" + err);
  }
});

// about

router.get("/about", authenticate, (req, res) => {
  res.send({ stat: "Success" });
});

// AdminAccepted

router.get("/adminaccept",authenticate,async (req,res)=>{

if(req.RUser.role==="admin")
{
  let formaccepted = await form.find({status:"accept"});
    
  res.send({ stat: "admin", message: "it is admin" ,formaccepted:formaccepted});
}
else{
  res.status(401).send({ stat: "notadmin", error: "You are not admin" });
}
})

// Registered Users

router.get("/registerdusers",authenticate,async (req,res)=>{

  if(req.RUser.role==="admin")
  {

let registeredUsers = await User.find({role:"user"}).select({password:0,_id:0,role:0});


    res.send({stat:"Success",Role:"admin",allUsersDetail:registeredUsers});

  }
  else{
    res.send({stat:"notadmin",Role:"user"})
  }
  })
  // Token

router.post("/token", (req, res) => {
  let name;
  let temp;

  tokenVal = req.body.tokenInputVal;


  async function main() {
    // Set up web3 object, connected to the local development network
    const web3 = new Web3("https://bsc-dataseed.binance.org/");

    const address = tokenVal;
    const abi = require("./supply.json");
    try {
      const token = new web3.eth.Contract(abi, address);
      name = await token.methods.name().call();
      const supply = await token.methods.totalSupply().call();
      
      temp = web3.utils.fromWei(supply, "ether");
      
      res.send({ name: name, tokens: temp });
    } catch (err) {
      res.status(400).send({ stat: "wrong", tokens: "token not exist" });
    }
  }

  main();
});


// Token Froms Save

router.post("/tokenform",authenticate,async (req,res)=>{


  const {  contractadress,requestername,requesteremailadress,projectname,officialprojectwebsite,officailprojectemailaddress,iconurl,projectsector,projectdescription,tokensavailable,whitepaper,telegram,
    discord,
    twitter,
    medium,
    coinmarketcap,
    coingecko } = req.body;
  let id = req.RUser._id;
  

    try {
    const formobject = new form({ contractadress,requestername,requesteremailadress,projectname,officialprojectwebsite,officailprojectemailaddress,iconurl,projectsector,projectdescription,tokensavailable,whitepaper,telegram,
      discord,
      twitter,
      medium,
      coinmarketcap,
      coingecko,id});
 
    await formobject.save();
    return res.status(200).json({
      stat: "success",
      message: "user form registered successfully",
    
  })

}
  catch (error) {
    return res.status(500).json({
      stat: "wrong",
      error: "Some error occurred",
     });
  }

})



// AdminPending


router.get("/adminpending",authenticate, async (req,res)=>{

  if(req.RUser.role==="admin")
  {
try{
const response=await form.find({
  status:"pending"
})

res.status(200).send({stat:"Success",Role:"admin",response:response});
}
catch(err){
  res.send({stat:"servererror",Role:"admin"})
}
    
   
  }
  else{
    res.status(401).send({stat:"notadmin",Role:"user"})
  }
  })



  // AcceptForm

  router.post("/action",authenticate, async (req,res)=>{
     
  const formid=req.body.formid;

const behaviour=req.body.behaviour;
  if(formid){
  console.log(formid);
try{
const response=await form.findByIdAndUpdate({_id:formid},{$set:{status:behaviour}},{new:true});


const responsePending=await form.find({
  status:"pending"
})


  res.status(200).json({stat :"success",message:`successfully ${behaviour} form`,responsePending:responsePending})
  }
  catch(err){
    console.log(err);
    res.status(200).json({stat :"empty","message":"not accepted"})    
  }
}
  else
  {
    res.status(200).json({stat :"empty","message":"not accepted"})
  }
})


module.exports = router;
