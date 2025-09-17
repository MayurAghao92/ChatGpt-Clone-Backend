import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';

async function authMiddleware(req, res, next){
    const {token}= req.cookies;
    if(!token){
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        const user= await userModel.findById(decoded.id);
    }catch(err){
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
}

export default authMiddleware;