const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../model/Profile');
const User = require('../../model/User');
const { check, validationResult } = require('express-validator/check');

// @route GET api/profile/me
//@desc   Get current user's profile
//@access  Private
router.get('/me',auth,async(req,res) => {
    try {
        console.log("sdfa",req.user)
        const profile = await Profile.findOne({user:req.user.id}).populate('user', ['name','avatar']);
        console.log(profile,"profile")
        if(!profile) {
            return res.status(400).json({msg:'There is no profile for this user'});
        }
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route POST api/profile/
//@desc   Create or update user profile
//@access Private

router.post('/',auth,[check('status','Status is required').not().isEmpty(),
check('skills', 'Skills are required').not().isEmpty()], 
async (req,res) => {
    const errors = validationResult(req);
    if( !errors.isEmpty) {
        return res.status(400).json({errors:errors.array()});
    }
})



module.exports = router;