const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const gravatar = require('gravatar');
const bcrypt =  require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../model/User');

// @route GE api/auth
//@desc   authentication route
//@access  Public(can be accessed without using Token)
router.get('/', auth, async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); //leave off password property
        res.json(user);  
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/',[
    check('email','Please inclued a valid email').isEmail(),
    check('password','Please enter a password with 6 or more characters').exists()
],
async (req,res) => {
    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
        return res.status(400).json({errors:errors.array()})
    }


    console.log(req.body);
    const { email, password } = req.body;

    try {

        //check if user exists
       
        let user = await User.findOne({email}); 
       
        if(!user) {
         return  res.status(400).json({errors:[{msg:'Invalid credentials'}]});
        }
       
        //Return jsonwebtoken
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
         return  res.status(400).json({errors:[{msg:'Invalid credentials'}]});
        }    

        const payload = {
            user:{
                id:user.id
            }
        }
        jwt.sign(payload, 
        config.get('jwtSecret'),
        { expiresIn:36000},
        (err, token)=> {
            if(err) throw err;
            res.json({token});
        });

        } catch(err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }

        


    
});

module.exports = router;