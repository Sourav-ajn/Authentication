const express = require('express');
const morgan = require('morgan')
const error= require('http-errors');
require('dotenv').config();
require('./utility/database');
require('./utility/redis');
const jwt_util = require('./utility/jwt_util');

const authRoute= require('./route/authRouter')


const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.get('/', jwt_util.verifyAccessToken, async (req, res, next) => {
    res.send('Hello from express.')
  })
  
app.use('/auth', authRoute);

app.use(async(req,res,next)=>{
    next(error.NotFound('This route does not exist'));
})

app.use((err,req,res,next)=>{
    res.status(err.status||500);
    res.send({
        error:{
            status : err.status||500,
            message : err.message
        }
    })
})
const port=process.env.PORT||5000;

app.listen(port,()=>{
    console.log('Server running on:' + port)
})
 