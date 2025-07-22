import dotenv from "dotenv";

dotenv.config();

export const config = {
    BOT_TOKEN: process.env.BOT_TOKEN!,
    MASTER_TELEGRAM_ID: process.env.MASTER_TELEGRAM_ID!,
};
