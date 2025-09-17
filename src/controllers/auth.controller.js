import userModel from "../models/user.model.js ";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


async function registerController(req, res){
    const{fullname:{firstname, lastname}, email, password}= req.body;

    const isUserExist=await userModel.findOne({email});
    if(isUserExist){
        return res.status(400).json({
            message: "User already exists",
        });
    }

    const hashPassword=bcrypt.hash(password, 10);
    const user=new userModel.create({
        fullname:{firstname, lastname},
        email: email,
        password: hashPassword,
    })

    const token=jwt.sign({id:user._id}, process.env.JWT_SECRET)

    res.cookie("token", token)

    return res.status(201).json({
        message: "User registered successfully",
        user:{
            id: user._id,
            fullname: user.fullname,
            email: user.email,
        },
    });
}

async function loginController(req, res){
    const{email, password}=req.body;

    const user= await userModel.findOne({
        email,
    });

    if(!user){
        return res.status(400).json({
            message: "User does not exist",
        });
    }
    const isPasswordValid= await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid password",
        });
    }
    const token= jwt.sign({id: user._id}, process.env.JWT_SECRET);
    res.cookie("token", token);

    return res.status(200).json({
        message: "User logged in successfully",
        user:{
            id: user._id,
            fullname: user.fullname,
            email: user.email,
        },
    });
}

export {registerController, loginController};