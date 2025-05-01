import { Request, Response } from "express";
import {  User } from "../models/schema";
import { generateAuthTokens } from "../config/token";

function validateEmail(email: string) {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
}

export default class AuthRouter {
    static signIn: any = async (req: Request, res: Response) => {
        
        try {
            const { email, password } = req.body
            const userInfo = await User.findOne({ email, password })
            if (!userInfo) {
                return res.status(403).send({status: false,error: "Invalid email or password"})
            }
            const token = await generateAuthTokens(userInfo._id)
            return res.status(200).send({status: true,message:"SignedIn Successfully",token})
        } catch (err: any) {
            return res.status(500).send({status: false,error: err.message})
        }
    }

    static signUp: any = async (req: any, res: Response) => {
        try {
            const { name, userName, email, password } = req.body;
            const user = await User.create({ name, username:userName, email, password })
            return res.status(200).send({success: true,message: "User created successfully",response: user})
        } catch (err: any) {
            return res.status(500).send({success: false,error: err.message})
        }

    }
}