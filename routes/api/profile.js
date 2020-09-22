const express = require('express');
const router = express.Router();


// @route GE api/profile
//@desc   Test route
//@access  Public(can be accessed without using Token)
router.get('/', (req,res) => res.send('Profile route'));

module.exports = router;