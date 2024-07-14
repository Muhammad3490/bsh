const Theme=require("../Models/Theme");
const multer  = require('multer')
const upload = multer({ dest: 'Themeuploads/' })
const User=require('../Models/User');
const getThemes=async(req,res)=>{
 try {
 
    const themes=await Theme.find({});
    if(themes.length>0){
        return res.json({status:"success",themes:themes});
    }
    else{
        return res.json({status:"success",message:"No themes available"});
    }
 } catch (error) {
    return res.json({status:"failed",error:error})
 }    
}
const viewForm=async(req,res)=>{
 try{
    return res.render('Themes/Form',{title:"Add Theme"});
 }catch(error){
    return res.json({status:'failed',error:error});
 }
}
const postTheme = async (req, res) => {
    const { type, name, backgroundColor, textColor, font, buttonStyle, userId } = req.body;
  
    if (!type || !name) {
      return res.status(400).json({ error: 'Type and name are required' });
    }
  
    if (!['predefined', 'custom'].includes(type)) {
      return res.status(400).json({ error: 'Invalid theme type' });
    }
  
    const newTheme = new Theme({
      type,
      name,
      backgroundColor,
      textColor,
      font,
      buttonStyle,
      backgroundImageUrl: req.files.backgroundImage ? `/themeUploads/${req.files.backgroundImage[0].filename}` : null,
      previewImageUrl: req.files.previewImage ? `/themeUploads/${req.files.previewImage[0].filename}` : null
    });
  
    if (type === 'custom') {
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required for custom themes' });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      newTheme.createdBy = userId;
    }
  
    try {
      const savedTheme = await newTheme.save();
      res.status(201).json(savedTheme);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating the theme' });
    }
  };


module.exports={
    getThemes,
    viewForm,
    postTheme
}