const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

// mongoose.connect(db) returns a Promise

const connectDB = async () => { //called in the entry point i.e. server
    try {
       await mongoose.connect(db, {
           useNewUrlParser:true,
           useCreateIndex:true,
           useUnifiedTopology:true
       });
       console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        //Exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;