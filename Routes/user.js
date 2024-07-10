const express=require('express');
const router=express.Router();
const {postUser,patchUser,deleteUser, getUser,getAllUsers}=require('../Controllers/user')
//post req
router.post('/', postUser);
//patch req
router.patch('/',patchUser);
//delete req
router.delete('/',deleteUser);
//get by id
router.get('/',getUser);
//get all user
router.get('/all',getAllUsers);
module.exports=router;