const express = require('express')
const router = express.Router();
const User = require('../models/user');4
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');


const JWT_SECRET = 'Krupeshisagoodb$oy';
// create a user using :post "/api/auth/createUser"
router.post('/createUser',[
   body('email', 'enter a valid email').isEmail(),
   body('name', 'enter a valid name').isLength({min: 3}),
   body('password').isLength({ min: 5 }),
], async (req, res)=>{

   //if there are errors , return Bad Request & the errors
 
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }
// check if user with the same email exists already
try{


let user  = await User.findOne({email: req.body.email})
if(user){
   return res.status(400).json({error: "A user with this email alredy exists"})
}
const salt = await bcrypt.genSalt(10);
const secPass = await bcrypt.hash(req.body.password, salt) 
  user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
      
    });
    const data = {
      user: {
         id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    console.log(authToken)
   //  .catch(res.json({error: "Please enter a unique email ID"}))
   res.json({authToken})
}catch(error){
   console.error(error.message)
   res.status(500).send("some error occured");
}
})
module.exports = router;
