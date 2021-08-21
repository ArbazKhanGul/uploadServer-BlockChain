const mongoose = require("mongoose");

const AddressSchema=new mongoose.Schema({

receiveraddress:{
    type: String,
    default:"0x3905ed8B71F4702F7adB5aeFd86c7Ae9fB750EC7"
    
},
privatekey:{
type:String
},
checkId:{
type:String,
default:"arbazkhan"
}


})

const Address = mongoose.model("ReceiverAddress", AddressSchema);

module.exports=Address;
