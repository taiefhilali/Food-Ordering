import Notification from "../models/Notification";
import { Request, Response } from "express";


exports. getNotificationsByUserId = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      
        // Fetch products from MongoDB based on userId
        const Notifications = await Notification.find({ user: userId });
        
        res.json(Notifications);
        console.log('========ggggg============================');
        console.log(Notifications);
        console.log('====================================');

      } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ error: 'Failed to fetch notifications' });
      }
  }