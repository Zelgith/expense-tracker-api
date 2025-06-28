import express from "express";
import {
	getSummaryById,
	createTransaction,
	deleteTransaction,
	getTransactionsByUserId,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.get("/:userId", getTransactionsByUserId);

router.post("/", createTransaction);

router.delete("/:id", deleteTransaction);

router.get("/summary/:userId", getSummaryById);

export default router;
