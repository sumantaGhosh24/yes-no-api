import express from "express";

import questionCtrl from "../controllers/questionCtrl";
import auth from "../middleware/auth";
import authAdmin from "../middleware/authAdmin";

const router = express.Router();

router.get("/admin/questions", authAdmin, questionCtrl.getQuestionsAdmin);

router.get("/admin/question/:id", authAdmin, questionCtrl.getQuestionAdmin);

router.post("/question", authAdmin, questionCtrl.createQuestion);

router.put("/question/:id", authAdmin, questionCtrl.updateQuestion);

router.delete("/question/:id", authAdmin, questionCtrl.deleteQuestion);

router.get("/admin/entrys", authAdmin, questionCtrl.getAllEntrys);

router.get("/entrys/questions/:id", authAdmin, questionCtrl.getQuestionEntrys);

router.post("/entrys/user/:id", authAdmin, questionCtrl.getUserEntrys);

router.post("/question/result/:id", authAdmin, questionCtrl.declareResult);

router.get("/questions", auth, questionCtrl.getQuestions);

router.get("/question/:id", auth, questionCtrl.getQuestion);

router.post("/question/:id", auth, questionCtrl.addEntry);

router.get("/entry/:id", auth, questionCtrl.getEntry);

router.get("/entrys", auth, questionCtrl.getMyEntrys);

export default router;
