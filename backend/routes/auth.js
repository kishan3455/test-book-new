const express=require('express');
const User=require('../models/User');
const router=express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Kishanisagoodb$oy';
// route:1 create user using:post "/api/auth/createuser" . no login required
router.post('/createuser',[
    body('name','Enter a valid name').isLength({ min: 3 }),
    body('email','Enter a valid email').isEmail(),
    body('password','password must be atlest 5 characters').isLength({ min: 5 }),
]
    ,async(req,res)=>{
        //if there are errors,return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check whether  the user with this email exists already
    try{
    let user=await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({error:"sorry a user with this email already exists"})
    }
    const salt=await bcrypt.genSalt(10);
     const secpass=await bcrypt .hash(req.body.password,salt);
    //create a new user
     user=await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secpass,
    })
    const data={
        user:{
            id:user.id
        }
    }
   const authtoken= jwt.sign(data,JWT_SECRET);
   
  // res.json({"Nice":"nice"})
  res.json({authtoken})
   //catch error
    }catch(error){
        console.log(error.message);
        res.status(500).send("internal server error");
    }
})
// route:2 authentication user using:post "/api/auth/login" . no login required
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','password cannot be blank').exists(),
   
]
    ,async(req,res)=>{
          //if there are errors,return bad request and the errors
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const{email,password}=req.body;
    try{
      let user=await User.findOne({email});
      if(!user){
        return res.status(400).json({error:"please try be not success"});
      }
      const passwordcompare=await bcrypt.compare(password,user.password);
      if(!passwordcompare){
        return res.status(400).json({error:"please try be not success"});
      }
     const data={
        user:{
            id:user.id
        }
    }
     const authtoken= jwt.sign(data,JWT_SECRET);
     res.json({authtoken})
    }catch(error){
        console.log(error.message);
        res.status(500).send("internal server error");
    
    }

    })    
   // route:3 get logeedin user detail using:post "/api/auth/getuser" .login required   
   router.post('/getuser',fetchuser,async(req,res)=>{
   try{
         userId=req.user.id;
         const user=await User.findById(userId).select("-password")
         res.send(user)
   }catch(error){
        console.log(error.message);
        res.status(500).send("internal server error");
    
   }
})
module.exports=router