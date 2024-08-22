const mongoose = require("mongoose");

const Schema=new mongoose.Schema({
    userId:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    title:{
        required:true,
        type:String
    },
    src:{
        required:true,
        type:String
    }
})
const Media=mongoose.model("media",Schema);

module.exports=Media