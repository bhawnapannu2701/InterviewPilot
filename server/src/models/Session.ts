import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISession extends Document {
  userId?: Types.ObjectId; // optional if anonymous
  sessionCookie?: string;
  topics: string[];
  difficulty: string;
  duration: number;
  startedAt: Date;
  endedAt?: Date;
}

const SessionSchema: Schema<ISession> = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    sessionCookie: { type: String }, // fallback for anonymous sessions
    topics: [{ type: String, required: true }],
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard", "Adaptive"], required: true },
    duration: { type: Number, required: true }, // in minutes
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
  },
  { timestamps: true }
);

export const Session = mongoose.model<ISession>("Session", SessionSchema);
