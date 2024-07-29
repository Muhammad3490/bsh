const express=require('express');
const router=express.Router();

const {getPage}=require("../Controllers/userPage");

router.get('/:userName',getPage);
module.exports=router;