import { neon } from "@neondatabase/serverless";
import "dotenv/config";

export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
	try {
		await sql`CREATE TABLE IF NOT EXISTS TRANSACTIONS(
            ID SERIAL PRIMARY KEY,
            USER_ID VARCHAR(255) NOT NULL,
            TITLE VARCHAR(255) NOT NULL,
            AMOUNT DECIMAL(10,2) NOT NULL,
            CATEGORY VARCHAR(255) NOT NULL,
            CREATED_AT DATE NOT NULL DEFAULT CURRENT_DATE
        )`;
		console.log("Database initialized succesfully");
	} catch (error) {
		console.log("Error initializing database", error);
		process.exit(1);
	}
}
