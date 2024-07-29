const mongoose = require("mongoose");

const Schema=new mongoose.Schema({
    userId:{
        type:String,
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
