// main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// DB Setup
var mongoDB = process.env.MONGODB_URI;
//var mongoDB = 'mongodb://localhost/auth';
mongoose.connect(mongoDB);

// App Setup
app.use(morgan('dev'));
// app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Server Setup
const port = process.env.port || 1111; 
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on port ', port);

