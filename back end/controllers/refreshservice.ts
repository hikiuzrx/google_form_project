import { generateAcessToken,generateRefreshToken } from "../utils/genToken";
import { db } from "../utils/db.server";
import jwt  from 'jsonwebtoken'
import { Request,Response } from "express";
import { configDotenv } from "dotenv";
import { User } from "@prisma/client";
configDotenv()
const getRefreshToken = async (req:Request,res:Response) =>{
     const authHeader :string | undefined = req.headers.authorization
     if (!authHeader) {
          return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
      
        // Check for the expected format (Bearer <token>)
        if (!authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
        }
      
        // Extract the token from the header
        const Refreshtoken = authHeader.substring(7); // Remove "Bearer " from the start of the string
      try {
          const refreshSecret :string|undefined = process.env.REFRESH_TOKEN_SECRET
          if(refreshSecret){
            const decoded = jwt.verify(refreshSecret,Refreshtoken)
               if((typeof decoded === 'object')&& ("id" in decoded)){
                    const {id} = decoded 
                    const user:User | null= await db.user.findFirst({
                       where:{
                            userId:(typeof id === 'string')?parseInt(id):id 
                       }
                    })
                    if(!user){
                         throw new Error('user not found ')
                    }else{
                         const newRefreshToken = generateRefreshToken(user.userId)
                         const newAccessToken = generateAcessToken(user.userId)
                         res.status(200).json({sucess:true,refreshToken:newRefreshToken,AccessToken :newAccessToken})
                    }
               }
          }else{
           throw new Error("env variables didn't load") 
          }
      } catch (error:any) {
          console.error(error.message)
          res.status(400).json({success:false ,message:`couldn't refresh the token reason :${error.message}`})
      }
}
export default getRefreshToken