const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const gravatar = require('gravatar');
const bcrypt =  require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')

const User = require('../../model/User');

// @route POST api/users
//@desc   Register users route
//@access  Public(can be accessed without using Token)
router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Please inclued a valid email').isEmail(),
    check('password','Please enter a password with 6 or more characters').isLength({min:6})
],
async (req,res) => {
    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
        return res.status(400).json({errors:errors.array()})
    }


    console.log(req.body);
    const { name, email, password } = req.body;

    try {

        //check if user exists
       
        let user = await User.findOne({email}); 
       
        if(user) {
         return  res.status(400).json({errors:[{msg:'User already exists'}]});
        }
       
        //Get users Gravitar

        const avatar = gravatar.url(email, {
            s: '200', //default size
            r: 'pg', // rating
            d: 'mm' // default in case of no gravatar
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });
        // Encrypt the password using bcrypt

        const salt = await bcrypt.genSalt(10);//more rounds more secure but slower 

        user.password = await bcrypt.hash(password, salt);

       await user.save(); //user is saved to db (use await on anything that returns a promise)

        //Return jsonwebtoken
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