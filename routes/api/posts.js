const express = require('express');
const router = express.Router();


// @route GE api/posts
//@desc   Test route
//@access  Public(can be accessed without using Token)
router.get('/', (req,res) => res.send('Posts route'));

module.exports = router;