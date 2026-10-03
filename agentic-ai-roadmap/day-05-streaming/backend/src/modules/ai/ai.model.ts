import { Schema, model, type Document } from "mongoose";

export interface IConversation extends Document {
  userId: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>({
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },{ timestamps: true, });

export const Conversation = model<IConversation>("Conversation", conversationSchema);