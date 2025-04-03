import mongoose, {Document} from "mongoose";

import {ICategory} from "./categoryModel";
import {IUser} from "./userModel";

export interface IQuestion extends Document {
  owner: IUser;
  category: ICategory;
  question: string;
  minBet: number;
  maxBet: number;
  starting: Date;
  ending: Date;
  result: "pending" | "completed";
  answer: "yes" | "no";
}

const questionSchema = new mongoose.Schema(
  {
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    question: {type: String, trim: true, required: true},
    minBet: {type: Number, required: true},
    maxBet: {type: Number, required: true},
    starting: {type: Date, required: true},
    ending: {type: Date, required: true},
    result: {type: String, default: "pending"},
    answer: {type: String},
  },
  {timestamps: true}
);

questionSchema.index({question: "text", category: "text"});

const Question = mongoose.model<IQuestion>("Question", questionSchema);

export default Question;
