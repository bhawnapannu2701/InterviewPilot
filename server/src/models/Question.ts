import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion extends Document {
  text: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  createdAt: Date;
}

const QuestionSchema: Schema<IQuestion> = new Schema<IQuestion>(
  {
    text: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    tags: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const Question = mongoose.model<IQuestion>("Question", QuestionSchema);
