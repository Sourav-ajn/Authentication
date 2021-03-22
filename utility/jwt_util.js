const jwt = require('jsonwebtoken');
const error = require('http-errors');
require('dotenv').config();

function genAccessToken(id){
    return new Promise((resolve,reject) => {
        const payload={
            aud:id
        }
        const options={
            expiresIn:'2h',
            issuer: 'auth.com',
        }

        jwt.sign(payload,process.env.JWT_SECRET,options,(err,token)=>{
            if(err){
                console.log(err)
                reject(error.InternalServerError())
            }
            resolve(token)
        })

    })
}
function verifyAccessToken(req, res, next) {
    if (!req.headers['authorization']) return next(createError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        if(err.name === 'JsonWebTokenError'){
            return next(createError.Unauthorized())
        }else{
        return next(createError.Unauthorized(err.message))
      }
    }
      req.payload = payload
      next()
    })
  }

function  genRefreshToken(Id){
    return new Promise((resolve, reject) => {
      const payload = {
          aud:Id
      }
      const secret = process.env.JWT_SECRET_RE
      const options = {
        expiresIn: '1y',
        issuer: 'pickurpage.com',
      }

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message)
          reject(createError.InternalServerError())
          return
        }

        client.SET(userId, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
          if (err) {
            console.log(err.message)
            reject(createError.InternalServerError())
            return
          }
          resolve(token)
        })
      })
    })
}
function verifyRefreshToken(refreshToken){
    return new Promise((resolve, reject) => {
        JWT.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) {
                return reject(createError.Unauthorized())
            }
            
            const userId = payload.aud
            client.GET(userId, (err, result) => {
              if (err) {
                console.log(err.message)
                reject(createError.InternalServerError())
                return
              }
              if (refreshToken === result){
                return resolve(userId)
              } 
              reject(createError.Unauthorized())
            })
          }
        )
    })
  }

module.exports={
    genAccessToken,
    verifyAccessToken,
    genRefreshToken,
    verifyRefreshToken
}