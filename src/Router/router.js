const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../Middleware/authenticate");
const Web3 = require("web3");
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

router.get("/adminaccept",authenticate,(req,res)=>{

if(req.RUser.role==="admin")
{
  res.send({ stat: "admin", error: "it is admin" });
}
else{
  res.status(401).send({ stat: "notadmin", error: "You are not admin" });
}
})

// AdminPending


router.get("/adminpending",authenticate,(req,res)=>{

  if(req.RUser.role==="admin")
  {
    res.send({stat:"Success",Role:"admin"});
  }
  else{
    res.send({stat:"Wrong",Role:"user"})
  }
  })

// Registered Users

router.get("/registerdusers",authenticate,async (req,res)=>{

  if(req.RUser.role==="admin")
  {

let registeredUsers = await User.find({role:"user"}).select({password:0,_id:0,role:0});
console.log(registeredUsers);

    res.send({stat:"Success",Role:"admin",allUsersDetail:registeredUsers});




  }
  else{
    res.send({stat:"Wrong",Role:"user"})
  }
  })
  // Token

router.post("/token", (req, res) => {
  let name;
  let temp;

  tokenVal = req.body.tokenInputVal;
  console.log(tokenVal);

  async function main() {
    // Set up web3 object, connected to the local development network
    const web3 = new Web3("https://bsc-dataseed.binance.org/");

    const address = tokenVal;
    const abi = require("./supply.json");
    try {
      const token = new web3.eth.Contract(abi, address);
      name = await token.methods.name().call();
      const supply = await token.methods.totalSupply().call();
      console.log(name);
      console.log(supply);
      temp = web3.utils.fromWei(supply, "ether");
      console.log(temp);
      res.send({ name: name, tokens: temp });
    } catch (err) {
      res.status(400).send({ stat: "wrong", tokens: "token not exist" });
    }
  }

  main();
});


module.exports = router;
