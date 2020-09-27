const express = require('express');
const connectDB = require('./config/db');
// const { json } = require('express');

const app = express();

//Connect Database
connectDB();

//Init Middleware
app.use(express.json({extended:false})); //based on body-parser

app.get('/', (req, res) => res.send('API Running')); // response sent back to the client by express backend

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));


const PORT = process.env.PORT || 5000; //runs on port 5000 when no port is present i.e. locally cause in Heroku we'll get process.env.port as we'll set the environment variable

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

