const mongoose = require("mongoose");

const Schema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
         ref:"users", 
        required:true,
    },
    themeId:{
        type:String,
        required:true
    },
    selected:{
        type:Boolean,
        required:true
    }
})


const SelectedTheme=mongoose.model("SelectedTheme",Schema);
module.exports=SelectedTheme;
