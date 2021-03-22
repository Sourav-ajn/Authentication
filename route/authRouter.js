
const express =require('express');
const router = express.Router();
const User = require('../models/userModel');
const error = require('http-errors');
const authSchema = require('../utility/validate_schema');
const jwt_util = require('../utility/jwt_util');
const Client = require('../utility/redis');


router.post('/register',async(req,res,next)=>{
    try {
        const result = await authSchema.validateAsync(req.body)

        const alreadyExist=await User.findOne({email:result.email})

        if (alreadyExist) {
            throw error.Conflict(`${result.email} is already exist`)
        }
        
        const user = new User(result)        
        const savedUser= await user.save()
        const accessToken= await jwt_util.genAccessToken(savedUser.id)
        const refreshToken= await jwt_util.genrRefreshToken(savedUser.id)

        res.send({accessToken, refreshToken})

    } catch (err) {
        if(err.isJoi==true){
            err.status = 422
        }
        next(err)
    }

})


router.post('/login',async(req,res,next)=>{
    try {
        const result = await authSchema.validateAsync(req.body)
        const user = await User.findOne({email:result.email})
        if(!user){
            throw error.BadRequest("Wrong Email or Password")
        }

        const isEqual= await user.isValidPassword(result.password);
        if(!isEqual){
            throw error.BadRequest("Wrong Email or Password")
        }

        const accessToken = await jwt_util.genAccessToken(user.id)
        const refreshToken= await jwt_util.genrRefreshToken(user.id)

        res.send({accessToken, refreshToken})

    } catch (error) {
        if (error.isJoi==true){
            error.BadRequest("Wrong Email or Password")
        }
        next(error)
    }
})

router.post('/refresh-token',async (req, res, next) => {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) throw createError.BadRequest()
      const userId = await jwt_util.verifyRefreshToken(refreshToken)

      const accessToken = await jwt-util.genAccessToken(userId)
      const refToken = await jwt_util.genRefreshToken(userId)
      res.send({ accessToken: accessToken, refreshToken: refToken })
    } catch (error) {
      next(error)
    }
})  

router.post('/logout', async (req, res, next) => {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) throw createError.BadRequest()
      const userId = await verifyRefreshToken(refreshToken)
      client.DEL(userId, (err, val) => {
        if (err) {
          console.log(err.message)
          throw createError.InternalServerError()
        }
        console.log(val)
        res.sendStatus(204)
      })
    } catch (error) {
      next(error)
    }
})

module.exports=router;