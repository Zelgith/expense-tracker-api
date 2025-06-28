import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
	try {
		const { userId } = req.params;

		const transactions = await sql`
            SELECT * FROM TRANSACTIONS WHERE USER_ID = ${userId} ORDER BY CREATED_AT DESC
        `;

		res.status(200).json(transactions);
	} catch (error) {
		console.log("Error getting the transactions", error);
		res.status(500).json({ message: "Internal server error" });
	}
}

export async function createTransaction(req, res) {
	try {
		const { title, amount, category, user_id } = req.body;

		if (!title || amount === undefined || !category || !user_id) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const transaction = await sql`
            INSERT INTO TRANSACTIONS(USER_ID,TITLE,AMOUNT,CATEGORY)
            VALUES (${user_id},${title},${amount},${category})
            RETURNING *
        `;
		res.status(201).json(transaction[0]);
	} catch (error) {
		console.log("Error creating the transaction", error);
		res.status(500).json({ message: "Internal server error" });
	}
}

export async function deleteTransaction(req, res) {
	try {
		const { id } = req.params;

		if (isNaN(parseInt(id))) {
			return res.status(400).json({ message: "Invalid transaction id" });
		}

		const result = await sql`
        DELETE FROM TRANSACTIONS WHERE id=${id} RETURNING *
    `;

		if (result.length === 0) {
			return res.status(404).json({ message: "Transaction not found" });
		}

		res.status(200).json({ message: "Transaction successfully deleted" });
	} catch (error) {
		console.log("Error deleting transactions", error);
		res.status(500).json({ message: "Internal server error" });
	}
}

export async function getSummaryById(req, res) {
	try {
		const { userId } = req.params;

		const balanceResult = await sql`
        SELECT COALESCE(SUM(AMOUNT),0) AS BALANCE FROM TRANSACTIONS WHERE USER_ID=${userId}
        `;

		const incomeResult = await sql`
        SELECT COALESCE(SUM(AMOUNT),0) AS INCOME FROM TRANSACTIONS WHERE USER_ID=${userId} AND AMOUNT > 0
        `;

		const expensesResult = await sql`
        SELECT COALESCE(SUM(AMOUNT),0) AS EXPENSES FROM TRANSACTIONS WHERE USER_ID=${userId} AND AMOUNT < 0
        `;

		res.status(200).json({
			balance: balanceResult[0].balance,
			income: incomeResult[0].income,
			expenses: expensesResult[0].expenses,
		});
	} catch (error) {
		console.log("Error getting the summary", error);
		res.status(500).json({ message: "Internal server error" });
	}
}
