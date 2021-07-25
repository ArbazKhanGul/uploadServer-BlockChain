const mongosse=require("mongoose");
const bcrypt=require("bcryptjs");

const UserSchema=new mongosse.Schema({
name:{
    type:String,
    required:true,
},
email:{
    type:String,
    required:true,
    unique:true
},
phone:{
    type: Number,
    required:true
},
password:{
    type:String,
    required:true,
}
})





// We are bcrypting password here

UserSchema.pre("save",async function(next){

    console.log("Running pre funciton")
if(this.isModified('password'))
{  
    this.password=await bcrypt.hash(this.password,12);
   
}
next()

})

const User=mongosse.model('SignUpForm',UserSchema);

module.exports=User;