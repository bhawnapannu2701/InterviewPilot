import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAttempt extends Document {
  sessionId: Types.ObjectId;
  questionId?: Types.ObjectId;
  topic: string;
  difficulty: string;
  userAnswer: string;
  aiFeedback: string;
  score: number; // 0 to 1
  createdAt: Date;
}

const AttemptSchema: Schema<IAttempt> = new Schema<IAttempt>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    questionId: { type: Schema.Types.ObjectId, ref: "Question" },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard", "Adaptive"], required: true },
    userAnswer: { type: String, required: true },
    aiFeedback: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 1 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const Attempt = mongoose.model<IAttempt>("Attempt", AttemptSchema);
