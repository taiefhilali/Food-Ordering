// models/Notification.ts

import mongoose, { Document } from 'mongoose';

export interface NotificationDocument extends Document {
  event: string;
  data: any;
  timestamp: Date;
}

const NotificationSchema = new mongoose.Schema({
  event: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<NotificationDocument>('Notification', NotificationSchema);
