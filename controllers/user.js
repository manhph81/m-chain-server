import express from 'express';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/user.js';

const router = express.Router();

export const signin = async (req, res) => {
    const {email, password} = req.body 
    try {
        
        const existingUser = await User.findOne({email});
        
        if(!existingUser) return res.status(200).json({message: "User doesn't exist"})
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if(!isPasswordCorrect) return res.status(200).json({message:"Invalid credentials password"})
        

        const token = jwt.sign({email:existingUser.email, id:existingUser._id}, 'test', { expiresIn:"1h" })
        res.status(200).json({result: existingUser, token})

    } catch (error) {
        res.status(200).json({ message: "Something went wrong." });
    }
}

export const signup = async (req, res) => { 
    const {email, password, firstName, lastName, confirmPassword, acType} = req.body 
    try {
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(200).json({message: "User already exist"})
        
        if(password!==confirmPassword) return res.status(200).json({message: "Password don't match"})
        if(acType!== "Supplier" && acType!== "Manufacturer" && acType!== "Distributor" && acType!== "Retailer" && acType!== "Consumer" ) return res.status(200).json({message:"Invalid Type"})
        const hashedPassword = await bcrypt.hash(password, 12)
        const result = await User.create({email, password: hashedPassword,acType, acName:`${firstName} ${lastName}`})
        const token = jwt.sign({email:result.email, id:result._id}, 'test', {expiresIn:"1h"})

        res.status(200).json({result, token})
    } catch (error) {
        res.status(200).json({ message: "Something went wrong." });
    }
}


export default router;