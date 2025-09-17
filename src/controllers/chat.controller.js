import chatModel from "../models/chat.model.js";

async function createChat(req, res){
    const {title}= req.body;
    const user= req.user;

    const chat=await chatModel.create({
        user:user._id,
        title,
    })

    return res.status(201).json({
        message: "Chat created successfully",
        chat:{
            id: chat._id,
            user: chat.user,
            title: chat.title,
            lastActivity: chat.lastActivity,
        },
    });
}

export {createChat};