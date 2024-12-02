import { db } from "../utils/db.server";
import { Request, Response } from "express";
import { User, RM } from "@prisma/client";
import { generateRandomPassword } from "../utils/credentatilsCheck";
import { generateAcessToken,generateRefreshToken } from "../utils/genToken";
 async function login(req: Request, res: Response) {
    const email = req.body.email; // No need for 'as string' if you validate below
    console.log('request arrived')
    console.log(req.body)
    try {
        if (typeof email === 'string' && email.trim() !== '') {
            let user: User | null = await db.user.findFirst({
                where: {
                    email: email,
                }
            });
            console.log('user found :\n' +user)
            if (!user) {
                // Create a new user if one doesn't exist
                
                const newUser: User = await db.user.create({
                    data: {
                        email,
                        userName: req.body.username, // Assuming name is passed in the body
                        method: RM.Google,
                        password: generateRandomPassword(),
                    }
                });

                if (newUser) {
                    console.log(' login sucess')
                    const accesstoken = generateAcessToken(newUser.userId)
                    const refreshToken = generateRefreshToken(newUser.userId)
                    return res.status(200).json({ success: true, email: newUser.email, name: newUser.userName ,refreshToken,accesstoken });
                }
            } else {
                
                console.log(' login sucess')// User exists
                const accesstoken = generateAcessToken(user.userId)
                const refreshToken = generateRefreshToken(user.userId)
                return res.status(200).json({ success: true, email: user.email, name: user.userName,refreshToken,accesstoken });
            }
        } else {
            throw new Error('Invalid email');
        }
    } catch (error) {
        // Return a user-friendly message
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        console.log(' login fail')
        return res.status(401).json({ success: false, message: errorMessage });
    }
}
export {login as Glogin}