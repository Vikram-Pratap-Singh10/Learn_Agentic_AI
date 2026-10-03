import { Schema, model, type Document, Types } from "mongoose";

export type MessageRole = "user" | "assistant";

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  userId: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    userId: {
      type: String,
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

messageSchema.index({
  conversationId: 1,
  createdAt: 1,
});

export const Message = model<IMessage>("Message", messageSchema);