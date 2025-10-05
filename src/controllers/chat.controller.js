import chatModel from "../models/chat.model.js";
import messageModel from "../models/messages.model.js";

async function createChat(req, res) {
  const { title } = req.body;
  const user = req.user;

  const chat = await chatModel.create({
    user: user._id,
    title,
  });

  return res.status(201).json({
    message: "Chat created successfully",
    chat: {
      id: chat._id,
      user: chat.user,
      title: chat.title,
      lastActivity: chat.lastActivity,
    },
  });
}

async function getChat(req, res) {
  const user = req.user;
  const chats = await chatModel
    .find({ user: user._id })
    .sort({ lastActivity: -1 });
  return res.status(200).json({
    message: "Chats fetched successfully",
    chats: chats.map((chat) => ({
      id: chat._id,
      user: chat.user,
      title: chat.title,
      lastActivity: chat.lastActivity,
    })),
  });
}

async function getMessages(req, res) {
  const chatID = req.params.id;

  const messages = await messageModel
    .find({ chat: chatID })
    .sort({ createdAt: 1 });
  return res.status(200).json({
    message: "Messages fetched successfully",
    messages: messages,
  });
}

async function deleteChat(req, res) {
  const chatId = req.params.id;
  const user = req.user;

  try {
    // Check if chat exists and belongs to user
    const chat = await chatModel.findOne({ _id: chatId, user: user._id });
    if (!chat) {
      return res.status(404).json({
        message: "Chat not found or unauthorized",
      });
    }

    // Delete all messages associated with this chat
    await messageModel.deleteMany({ chat: chatId });

    // Delete the chat
    await chatModel.findByIdAndDelete(chatId);

    return res.status(200).json({
      message: "Chat and associated messages deleted successfully",
      chatId: chatId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting chat",
      error: error.message,
    });
  }
}

export { createChat, getChat, getMessages, deleteChat };
