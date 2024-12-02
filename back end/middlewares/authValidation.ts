import { config, configDotenv } from "dotenv";
import { db } from "../utils/db.server";
import jwt from 'jsonwebtoken'
import { generateAcessToken,generateRefreshToken } from "../utils/genToken";
import { NextFunction, Request,Response } from "express";
import { customRequest } from "../types/types";
import { JwtPayload } from "jsonwebtoken";
configDotenv()
const authValidator = async (req:customRequest,res:Response,next:NextFunction)=>{
     console.log('we are in the middlwere')
     const authorizationHeader:string | undefined = req.headers.authorization;

  // Check if Authorization header exists
  if (!authorizationHeader) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  // Check for the expected format (Bearer <token>)
  if (!authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
  }

  // Extract the token from the header
  let accesstoken = authorizationHeader.substring(7) as string; // Remove "Bearer " from the start of the string

  
    // Verify the JWT token
    let secret:string|undefined = process.env.ACESS_TOKEN_SECRET;
    console.log(secret)
    if(accesstoken){
     if (secret) {
          jwt.verify(accesstoken,secret,(err:any,user:any)=>{
              if(err){
                   secret = process.env.REFRESH_TOKEN_SECRET as string
                   let {refreshToken } = req.body
                   if(!refreshToken){
                        res.status(401).json({sucess:false,message:'no refreshToken provided'})
                   }else{
                        jwt.verify(refreshToken,secret,(err:any,user:any) =>{
                             if(err){
                                  res.status(401).json({sucess:false,message:'unvalid refresh token'})
                             }else{
                                   req.userId = user.userId
                                   refreshToken = generateRefreshToken((typeof user.userId==='number')?user.userId:parseInt(user.userId))
                                   accesstoken =  generateAcessToken((typeof user.userId==='number')?user.userId:parseInt(user.userId)) as string
                                   req.refreshToken = refreshToken
                                   req.accessToken = accesstoken
                                  next()
                             }
                        })
                   }
              }else{
               req.userId = user.userId
               const  refreshToken = generateRefreshToken((typeof user.userId==='number')?user.userId:parseInt(user.userId)) as string
               accesstoken =  generateAcessToken((typeof user.userId==='number')?user.userId:parseInt(user.userId)) as string
               req.refreshToken = refreshToken
               req.accessToken = accesstoken
               next()
              }
          })
          next();
        }
        // Handle JWT verification errors
        res.status(401).json({ message: 'Unauthorized: Invalid token' });    
    }
}
export default authValidator