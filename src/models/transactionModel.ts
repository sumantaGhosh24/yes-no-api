import mongoose from "mongoose";

import {IUser} from "./userModel";

export interface ITransaction extends Document {
  user: IUser;
  amount: number;
  message: string;
  status: "deposit" | "withdraw" | "bet" | "win" | "penalty" | "refund";
  paymentResult?: {
    id: string;
    status: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  };
}

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    amount: {type: Number, required: true},
    message: {type: String, required: true},
    status: {type: String, required: true},
    paymentResult: {
      id: {type: String},
      status: {type: String},
      razorpay_order_id: {type: String},
      razorpay_payment_id: {type: String},
      razorpay_signature: {type: String},
    },
  },
  {timestamps: true}
);

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);

export default Transaction;
