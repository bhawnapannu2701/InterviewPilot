import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
  sessionId: Types.ObjectId;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<IMessage> = new Schema<IMessage>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
