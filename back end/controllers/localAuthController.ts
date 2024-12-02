import { db } from "../utils/db.server";
import { Request,Response } from "express";
import { isEmailValid,checkPasswordStrength } from "../utils/credentatilsCheck";
import { generateAcessToken,generateRefreshToken } from "../utils/genToken";
import bcrypt from 'bcrypt'
import { User } from "@prisma/client";
async function signUp (req:Request,res:Response){
     console.log('request arrived')
     const userData  = req.body
     console.log(userData)
     console.log( "identifier"+userData.identifider)
     try {
          
          let u :User|any = await db.user.findFirst({
               where:{
                    email:userData.email
               }
          })
          if(!u){
               u = await db.user.findFirst({
                    where:{
                         userName:userData.username
                    }
               })
               if(u){
                    const refreshToken:string |undefined = generateRefreshToken(u.userId)
                    const accesstoken :string |undefined= generateAcessToken(u.userId)  
                   res.status(200).json({userExists:true,name:u,email:u.email,refreshToken,accesstoken})
               }
          }else{
               console.log(req.body)
               console.log(isEmailValid(userData.email))
               if(isEmailValid(userData.email as string)){
                    let ps =checkPasswordStrength(userData.password)
                    console.log(ps)
                    if( ps === 'Strong password!'){
                         const salt = await bcrypt.genSalt()
                         const hashP =  await bcrypt.hash(userData.password,salt)
                         u = await db.user.create({
                              data:{
                                   userName:userData.username,
                                   firstName:userData.firstName,
                                   lastName:userData.lastName,
                                   email:userData.email,
                                   password:hashP
                              }
                         })
                         const refreshToken:string |undefined = generateRefreshToken(u.userId)
                         const accesstoken :string |undefined= generateAcessToken(u.userId)  
                         res.status(200).json({register:true,name:u.userName,email:u.email,refreshToken,accesstoken})
                    }else{
                         throw new Error(ps)
                    }
               }else{
                    throw new Error('unvalid email')
               }
              
          }
     } catch (error:any) {
          console.error(error)
          res.status(401).json({signUp:false,message:error.message})
     }
}
async function login (req:Request,res:Response){
     const {identifier,password}  = req.body
     console.log(req.body)

     console.log('request arrived')
     console.log( identifier)
     let u
    try{
     if(identifier){
          if(isEmailValid(identifier)){
               u  = await  db.user.findFirst({
                    where:{
                         email:identifier
                    }
               })
          }else{
               
               u =await  db.user.findFirst({
                    where:{
                         userName:identifier
                    }
               })
          }
     }else{
          throw new Error('identifider missing !')
     }
     if(password){   
          if(u){
                  const auth  = await bcrypt.compare(password, u.password as string)
                  console.log(auth)
                  if(auth){
                       const refreshToken =  generateRefreshToken(u.userId)
                       const accesstoken = generateAcessToken(u.userId)
                       console.log(refreshToken)
              /*          res.cookie('jwt',token,{maxAge:60*60*1000}) */
                       res.status(200).json({email:u.email,name:u.userName,refreshToken,accesstoken})
                  }else{
                       throw new Error('wrong password')
                  }
             }else{
                  throw new Error('user not found! wrong email')
             }
      
   }else{
        throw new Error('password required')
   }
   }catch(error){
   console.error(error)
   res.status(400).json({login:false,message:error})
}
    }
    

export {login,signUp}