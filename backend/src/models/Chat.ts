import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  sender: mongoose.Schema.Types.ObjectId; // Reference to a User
  content: string;
  replyTo?: mongoose.Schema.Types.ObjectId; // Optional reference to another Chat
  createdAt: Date;
}

const chatSchema: Schema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    replyTo: { type: Schema.Types.ObjectId, ref: 'Chat' }, // Reference to another Chat document
    createdAt: { type: Date, default: Date.now } // Default to current date
  },
  { timestamps: { createdAt: true, updatedAt: true } } // Manage both createdAt and updatedAt
);

export default mongoose.model<IChat>('Chat', chatSchema);
