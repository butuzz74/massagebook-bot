import { Telegraf, Markup } from "telegraf";
import { config } from "./config";
import Booking from "./models/Booking";
import { connectDb } from "./db";
import { formatDate } from "./utils/formatDate";
import express from "express";
import cors from "cors";

type BookingType = {
    telegramId?: number;
    massage?: string;
    date?: string;
    time?: string;
    name?: string;
    phone?: string;
};

const app = express();
app.use(cors());
app.use(express.json());

const bot = new Telegraf(config.BOT_TOKEN);

app.post("/booking", async (req, res) => {
    const { time, telegramId, massage, date, name, phone } =
        req.body as BookingType;

    if (!telegramId) return res.status(400).send("telegramId обязателен");

    try {
        await bot.telegram.sendMessage(
            telegramId,
            `✅ ${name}, ваша запись подтверждена:\n💆‍♂️ ${massage}\n📅 ${date}\n⏰ ${time}\n📞 ${phone}`
        );

        await bot.telegram.sendMessage(
            process.env.MASTER_TELEGRAM_ID!,
            `📬 Новый заказ:\n👤 ${name}\n💆‍♂️ ${massage}\n📅 ${date}\n⏰ ${time}\n📞 ${phone}`
        );

        res.send({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).send("Ошибка при отправке сообщения");
    }
});

const PORT = parseInt(config.PORT || "3001", 10);

app.listen(PORT, "0.0.0.0", () => console.log("Listening on all interfaces"));

bot.start(async (ctx) => {
    await ctx.reply(
        "Добро пожаловать! Выберите действие:",
        Markup.inlineKeyboard([
            [
                Markup.button.webApp(
                    "🗓 Записаться",
                    "https://massagebook-web.vercel.app"
                ),
            ],
            [Markup.button.callback("📋 Мои записи", "my_bookings")],
        ])
    );
});

bot.action("my_bookings", async (ctx) => {
    const telegramId = ctx.from?.id;
    if (!telegramId) return ctx.reply("Не удалось определить Ваш telegramId");

    await connectDb();
    const bookings = await Booking.find({ telegramId });

    if (bookings.length === 0)
        return ctx.reply("У вас нет актуальных записей.");

    const currentDate = formatDate(new Date());

    const text = bookings
        .filter(
            (elem) =>
                elem.date &&
                typeof elem.date === "string" &&
                elem.date >= currentDate
        )
        .map(
            (elem, index) =>
                `${index + 1}️⃣ 💆‍♂️ <b>${elem.massage}</b>\n📅 <b>${
                    elem.date
                }</b> ⏰ <b>${elem.time}</b>`
        )
        .join("\n\n");

    await ctx.reply(`Ваши записи:\n\n${text}`, { parse_mode: "HTML" });
});

export default bot;
