import {Request, Response} from "express";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";

import {IReqAuth} from "../types";
import Transaction from "../models/transactionModel";
import User from "../models/userModel";
import {APIFeatures} from "../lib";

dotenv.config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const walletCtrl = {
  deposit: async (req: Request, res: Response) => {
    try {
      const {amount} = req.body;
      const options = {
        amount: Number(amount * 100),
        currency: "INR",
      };

      const order = await instance.orders.create(options);
      if (!order) {
        res.status(500).json({message: "server error"});
        return;
      }

      res.json(order);
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  verification: async (req: IReqAuth, res: Response) => {
    try {
      const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        amount,
      } = req.body;
      const user = req?.user?._id;

      const shasum = crypto.createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      );
      shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
      const digest = shasum.digest("hex");
      if (digest !== razorpaySignature) {
        res.status(400).json({message: "Transaction not legit!"});
        return;
      }

      const newTransaction = new Transaction({
        user: user,
        amount: amount,
        message: `${amount} INR deposited`,
        status: "deposit",
        paymentResult: {
          id: orderCreationId,
          status: "success",
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
        },
      });
      await newTransaction.save();

      await User.findByIdAndUpdate(user, {$inc: {amount: amount}});

      res.json({
        message: "success",
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
      });
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  withdraw: async (req: IReqAuth, res: Response) => {
    try {
      const {amount, upiId} = req.body;

      if (req!.user!.amount < amount) {
        res.status(400).json({message: "Insufficient balance."});
        return;
      }

      // const payoutOptions = {
      //   account_number: upiId,
      //   amount: Number(amount * 100),
      //   currency: "INR",
      //   mode: "UPI",
      //   purpose: "payout",
      //   queue_if_low_balance: false,
      // };

      // const payout = await instance.payouts.create(payoutOptions);

      await User.findByIdAndUpdate(req?.user?._id, {$inc: {amount: -amount}});

      res.json({message: "Withdrawal successful."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getWallet: async (req: IReqAuth, res: Response) => {
    try {
      const user = req?.user?._id;
      const amount = req?.user?.amount;

      const features = new APIFeatures(
        Transaction.find({user: user}),
        req.query
      )
        .paginating()
        .sorting();
      const features2 = new APIFeatures(
        Transaction.find({user: user}),
        req.query
      );

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const transactions =
        result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.json({amount, transactions, count});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getTransaction: async (req: IReqAuth, res: Response) => {
    try {
      const transaction = await Transaction.findById(req.params.id);

      res.json(transaction);
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getWalletById: async (req: IReqAuth, res: Response) => {
    try {
      const user = req?.params?.user;

      const amount = await User.findById(user).select("amount");

      const features = new APIFeatures(
        Transaction.find({user: user}),
        req.query
      )
        .paginating()
        .sorting();
      const features2 = new APIFeatures(
        Transaction.find({user: user}),
        req.query
      );

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const transactions =
        result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.json({amount, transactions, count});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getAllTransactions: async (req: IReqAuth, res: Response) => {
    try {
      const features = new APIFeatures(Transaction.find(), req.query)
        .paginating()
        .sorting()
        .searching()
        .filtering();
      const features2 = new APIFeatures(Transaction.find(), req.query)
        .searching()
        .filtering();

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const transactions =
        result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.json({transactions, count});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  penalty: async (req: IReqAuth, res: Response) => {
    try {
      const user = req.params.user;
      const amount = req.body.amount;

      if (!amount) {
        res.status(400).json({message: "Penalty amount is required"});
        return;
      }

      await User.findByIdAndUpdate(user, {$inc: {amount: -amount}});

      const newTransaction = new Transaction({
        user: user,
        amount: amount,
        message: `${amount} INR penalty deducted`,
        status: "penalty",
      });
      await newTransaction.save();

      res.status(200).json({message: "Penalty amount deducted."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
};

export default walletCtrl;
