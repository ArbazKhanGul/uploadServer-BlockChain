const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../Middleware/authenticate");
const Web3 = require("web3");
const form=require("../models/FormSchema");
const Address=require("../models/AddressSchema");

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


//ReceiverAddress
router.get("/receiveraddress",authenticate,async (req,res)=>{

  if(req.RUser.role==="admin")
  {

    res.send({ stat: "admin", message: "it is admin"});
  }
  else{
    res.status(401).send({ stat: "notadmin", error: "You are not admin" });
  }
  })
  

  // Verify Address
  router.post("/verifyaddress",authenticate,async (req,res)=>{
 
  
    if(req.RUser.role==="admin")
    {
      try{
const address=req.body.address;
const key=req.body.privatekey;
console.log(key);
let result= await Web3.utils.isAddress(address);

if(result){
  const receive=await Address.update({checkId:"arbazkhan"},{$set : {receiveraddress:address,privatekey:key}},{new:true});
  console.log(receive);
    res.send({ stat: "admin", message: "it is admin",formstatus:true});
  
  }
  else{
    res.send({ stat: "admin", message: "it is admin",formstatus:false});
  }
      
        }catch(err){
          res.send({ stat: "admin", message: "it is admin",formstatus:"error"});
        }    }
    else{
      res.status(401).send({ stat: "notadmin", error: "You are not admin" });
    }
    })
    

    
// GetReceiverAddress

router.get("/getreceiveraddress",async (req,res)=>{

  try{
    const receive=await Address.findOne({checkId:"arbazkhan"});
    console.log(receive.receiveraddress);
    res.send({ stat: "admin", message: "it is admin",receive:receive});
  }
  catch(err){
    res.send({ stat: "admin", message: "it is admin",receive:"error"});
  }
  })
  

    //Client

router.get("/client",authenticate,async (req,res)=>{
let temp = req.RUser._id;
console.log(temp)
    let formaccepted = await form.find({id:temp});
      
    res.send({ stat: "success", message: "successfully send" ,formaccepted:formaccepted});
  
  
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

  // data-seed-prebsc-1-s1.binance.org:8545
  async function main() {
    // Set up web3 object, connected to the local development network
    const web3 = new Web3("https://data-seed-prebsc-1-s3.binance.org:8545/");

    const address = tokenVal;
    const abi = require("./supply.json");
    try {
      const token = new web3.eth.Contract(abi, address);
      name = await token.methods.name().call();
      const supply = await token.methods.totalSupply().call();
      const decimal =await token.methods.decimals().call();
      const symbol =await token.methods.symbol().call();
    


      console.log("Printing decimal value"+decimal)
      console.log("Printing symbol value"+symbol)
      

      temp = web3.utils.fromWei(supply, "ether");
      
      res.send({ name: name, tokens: temp ,decimal:decimal,symbol:symbol,chain:"BEP20"});
    } catch (err) {
      console.log(err)
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
    coingecko,hash ,totaltokenssend,tokenprice,tokensymbol,
    tokenchain,
    tokendecimal} = req.body;
  let id = req.RUser._id;
  
  console.log(req.body);
console.log(hash);
    try {
    const formobject = new form({ contractadress,requestername,requesteremailadress,projectname,officialprojectwebsite,officailprojectemailaddress,iconurl,projectsector,projectdescription,tokensavailable,whitepaper,telegram,
      discord,
      twitter,
      medium,
      coinmarketcap,
      coingecko,id,hash,tokenprice,totaltokenssend,tokensymbol,
      tokenchain,
      tokendecimal});
 
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
console.log(response)
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

console.log(response);
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

// formdetail
router.get("/formdetail",async (req,res)=>{

  
  try{
    let formaccepted = await form.find({status:"accept"});
      
    res.send({ stat: "success", message: "data send" ,formaccepted:formaccepted});
  }
  catch{
    res.status(401).send({ stat: "fail", error: "error come" });
  }
  })
  
  //detailType
  router.post("/detailtype",async (req,res)=>{

  const id=req.body.detailtype;
  console.log(id)
    try{
      let formaccepted = await form.find({_id:id});
        
      res.send({ stat: "success", message: "data send" ,formaccepted:formaccepted});
    }
    catch{
      res.status(401).send({ stat: "fail", error: "error come" });
    }
    })
    


module.exports = router;
