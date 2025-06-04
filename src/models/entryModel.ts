import mongoose, {Document} from "mongoose";

import {IQuestion} from "./questionModel";
import {IUser} from "./userModel";

export interface IEntry extends Document {
  user: IUser;
  question: IQuestion;
  bet: number;
  win: number;
  result: "success" | "failed" | "pending";
  answer?: string;
}

const entrySchema = new mongoose.Schema(
  {
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    bet: {type: Number, required: true},
    win: {type: Number, required: true, default: 0},
    result: {type: String, default: "pending"},
    answer: {type: String},
  },
  {timestamps: true}
);

const Entry = mongoose.model<IEntry>("Entry", entrySchema);

export default Entry;
