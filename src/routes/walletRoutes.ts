import express from "express";

import walletCtrl from "../controllers/walletCtrl";
import auth from "../middleware/auth";
import authAdmin from "../middleware/authAdmin";

const router = express.Router();

router.post("/deposit", auth, walletCtrl.deposit);

router.post("/verify", auth, walletCtrl.verification);

router.post("/withdraw", auth, walletCtrl.withdraw);

router.get("/wallet", auth, walletCtrl.getWallet);

router.get("/transaction/:id", auth, walletCtrl.getTransaction);

router.get("/wallet/:user", authAdmin, walletCtrl.getWalletById);

router.get("/all-transactions", authAdmin, walletCtrl.getAllTransactions);

router.post("/penalty/:user", authAdmin, walletCtrl.penalty);

export default router;
