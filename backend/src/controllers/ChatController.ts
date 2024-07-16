import { Request, Response } from 'express';
import Chat, { IChat } from '../models/Chat';
import { Server as SocketIOServer, Socket } from 'socket.io'; // Import types for Socket.IO
import User from '../models/User';

// Function to fetch messages from MongoDB
export const FetchMessages = async (_req: Request, res: Response) => {
  try {
    const messages: IChat[] = await Chat.find().populate('sender', 'username imageUrl');
    console.log('Fetched messages:', messages); // Log fetched messages
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to handle incoming chat messages
export const handleChatMessage = async (data: any, io: SocketIOServer) => {
  try {
    const { sender, content, replyTo } = data;

    // Save message to MongoDB
    const newMessage = new Chat({ sender, content, replyTo });
    await newMessage.save();

    // Populate sender information
    const populatedMessage = await newMessage.populate('sender', 'username imageUrl');

    // Fetch original message if replying
    let originalMessage = null;
    if (replyTo) {
      originalMessage = await Chat.findById(replyTo).populate('sender', 'username imageUrl').exec();
    }

    // Broadcast message to all clients
    io.emit('chat message', {
      message: populatedMessage.toJSON(), // Convert to plain object
      originalMessage: originalMessage ? originalMessage.toJSON() : null, // Convert original message if exists
    });
  } catch (error) {
    console.error('Error saving or fetching message:', error);
  }
};

export const saveMessage = async (req: Request, res: Response) => {
    try {
      const { sender, content } = req.body;
  
      const newMessage = new Chat({ sender, content });
      await newMessage.save();
  
      console.log('Message saved:', newMessage); // Log saved message
      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  export const fetchusersByUserType=  async (req: Request, res: Response) =>{
     try {
        const userId = (req as any).user.id; // Assuming `req.user` contains authenticated user's information
        if (!userId) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    // Fetch all users who are clients
    const clients = await User.find({ userType: 'Client' }).exec();

    // Fetch chats where the vendor is either the sender or the recipient
    const chats = await Chat.find({
      $or: [{ sender: userId }, { replyTo: userId }]
    }).exec();

    // Extract user IDs from chats
    const userIdsFromChats = chats.map(chat => chat.sender.toString());

    // Filter clients who have chatted with the vendor
    const filteredClients = clients.filter(client => userIdsFromChats.includes(client._id.toString()));

    res.json(filteredClients);
  } catch (error) {
    res.status(500).json("server error");
  }}