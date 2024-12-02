import { db } from "../utils/db.server";
import { Forms, User } from "@prisma/client";
import { Question ,Type} from "@prisma/client";
import { Response } from "express";
import { customRequest, userError } from "../types/types";

export const newForm = async (req: customRequest, res: Response) => {
 try {
     const user :User | null = await  db.user.findFirst({
          where:{
               userId : (typeof req.userId === "string") ? parseInt(req.userId) : req.userId 
          }
         })
         if(!user){
               throw new userError('UserNotFound','there was no user with this ID ')  
         }else{
          const formdata = req.body
          if(!formdata){
               throw new Error('empty body')
          }else{
               let form :Forms |undefined = await db.forms.create({
                    data :{
                         ownerId :(typeof user.userId==='number')?user.userId:parseInt(user.userId),
                         title :formdata.title as string ,
                         dateCreation :new Date() ,
                    },
               })
               if(!form){
                    throw new Error('error while creating the form')
               }else{
                  
               }
          }
         }
 } catch (error:any) {
     if(error instanceof userError){
          res.status(400).json({success:false,message:error.message})
     }
     res.status(400).json({success:false,message:error.message})
 }
};

