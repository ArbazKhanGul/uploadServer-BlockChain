const mongoose = require("mongoose");

const FormSchema=new mongoose.Schema({

    contractadress:{
        type:String
    },
    requestername:{
        type:String
    },
    requesteremailadress:{
type:String
    },
    projectname:{
        type:String
    },
    officialprojectwebsite:{
type:String
    },
    officailprojectemailaddress:{
type:String
    },
    iconurl:{
type:String
    },
    projectsector:{
type:String
    },
    projectdescription:{
type:String
    },
    tokensavailable:{
type:Number
    },
whitepaper:{
type:String
},
telegram:{
type:String
},
discord:{
type:String
},
twitter:{
type:String
},
medium:{
type:String
},
coinmarketcap:{
type:String
},
coingecko:{
    type:String
},
id:{
    type:String
},
status:{
    type:String,
    default:"pending"
},
hash:{
    type:String
}
})

const Form = mongoose.model("TokenForm", FormSchema);

module.exports=Form;
