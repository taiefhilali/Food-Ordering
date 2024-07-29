// models/Notification.ts

import mongoose, { Document } from 'mongoose';

export interface NotificationDocument extends Document {
  event: string;
  data: any;
  timestamp: Date;
  user:string;
}

const NotificationSchema = new mongoose.Schema({
  event: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // Reference to the User model
  },
});

export default mongoose.model<NotificationDocument>('Notification', NotificationSchema);
