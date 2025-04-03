import {Request, Response} from "express";

import Category from "../models/categoryModel";
import Entry from "../models/entryModel";
import Question from "../models/questionModel";
import Transaction from "../models/transactionModel";
import User from "../models/userModel";
import {IReqAuth} from "../types";

const dashboardCtrl = {
  getAdminDashboard: async (req: Request, res: Response) => {
    try {
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({status: "active"});
      const totalTransactions = await Transaction.countDocuments();
      const totalQuestions = await Question.countDocuments();
      const pendingQuestions = await Question.countDocuments({
        result: "pending",
      });
      const totalCategories = await Category.countDocuments();
      const totalEntries = await Entry.countDocuments();

      const recentUsers = await User.find().sort({createdAt: -1}).limit(5);
      const recentTransactions = await Transaction.find()
        .sort({createdAt: -1})
        .limit(5)
        .populate("user");
      const recentQuestions = await Question.find()
        .sort({createdAt: -1})
        .limit(5)
        .populate("owner")
        .populate("category");
      const recentEntries = await Entry.find()
        .sort({createdAt: -1})
        .limit(5)
        .populate("user")
        .populate("question");
      const recentCategories = await Category.find()
        .sort({createdAt: -1})
        .limit(5);

      const totalDepositAmount = await Transaction.aggregate([
        {$match: {status: "deposit"}},
        {$group: {_id: null, total: {$sum: "$amount"}}},
      ]);

      const totalWithdrawalAmount = await Transaction.aggregate([
        {$match: {status: "withdraw"}},
        {$group: {_id: null, total: {$sum: "$amount"}}},
      ]);

      res.status(200).json({
        totalUsers,
        activeUsers,
        totalTransactions,
        totalQuestions,
        pendingQuestions,
        totalCategories,
        totalEntries,
        recentUsers,
        recentTransactions,
        recentQuestions,
        recentEntries,
        recentCategories,
        totalDepositAmount: totalDepositAmount[0]?.total || 0,
        totalWithdrawalAmount: totalWithdrawalAmount[0]?.total || 0,
      });
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getDashboard: async (req: IReqAuth, res: Response) => {
    try {
      const userId = req.user?._id;

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const userTransactions = await Transaction.find({user: userId})
        .sort({createdAt: -1})
        .populate("user");
      const userEntries = await Entry.find({user: userId})
        .sort({createdAt: -1})
        .populate("question");
      const userQuestions = await Question.find({owner: userId})
        .sort({createdAt: -1})
        .populate("category");

      const totalBets = await Entry.aggregate([
        {$match: {user: userId}},
        {$group: {_id: null, total: {$sum: "$bet"}}},
      ]);
      const totalWins = await Entry.aggregate([
        {$match: {user: userId, result: "success"}},
        {$group: {_id: null, total: {$sum: "$win"}}},
      ]);
      const totalDeposits = await Transaction.aggregate([
        {$match: {user: userId, status: "deposit"}},
        {$group: {_id: null, total: {$sum: "$amount"}}},
      ]);
      const totalWithdrawals = await Transaction.aggregate([
        {$match: {user: userId, status: "withdraw"}},
        {$group: {_id: null, total: {$sum: "$amount"}}},
      ]);

      res.status(200).json({
        user,
        userTransactions,
        userEntries,
        userQuestions,
        totalBets: totalBets[0]?.total || 0,
        totalWins: totalWins[0]?.total || 0,
        totalDeposits: totalDeposits[0]?.total || 0,
        totalWithdrawals: totalWithdrawals[0]?.total || 0,
      });
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
};

export default dashboardCtrl;
