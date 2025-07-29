import { Telegraf, Markup } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";
import { config } from "./config";
import Booking from "./models/Booking";
import { connectDb } from "./db";
import { formatDate } from "./utils/formatDate";

const bot = new Telegraf(config.BOT_TOKEN);

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
    await ctx.answerCbQuery();

    const telegramId = ctx.from?.id;
    if (!telegramId) return ctx.reply("Не удалось определить Ваш telegramId");

    await connectDb();
    const bookings = await Booking.find({ telegramId });

    if (bookings.length === 0)
        return ctx.reply("У вас нет актуальных записей.");

    const currentDate = formatDate(new Date());

    const text = bookings.map((elem, index) => {
        if (
            elem.date &&
            typeof elem.date === "string" &&
            elem.date >= currentDate
        ) {
            return `${index + 1}. 💆‍♂️ ${elem.massage}\n   📅 ${elem.date} ⏰ ${
                elem.time
            }`;
        }
    });
    await ctx.reply(`Ваши записи:\n\n${text}`);
});

bot.on("message", async (ctx) => {
    const message = ctx.message as Message.WebAppDataMessage;

    if (message.web_app_data && message.web_app_data.data) {
        try {
            const data = JSON.parse(message.web_app_data.data);
            await ctx.reply(
                `${data.name}! Спасибо за Ваш выбор!\nВы записались на: ${data.massage}\nДата: ${data.date}\nВремя: ${data.time}\nМастер свяжется с Вами по телефону ${data.phone} для уточнения деталей`
            );

            await ctx.telegram.sendMessage(
                config.MASTER_TELEGRAM_ID,
                `📬 Новый заказ:\n👤 Клиент: ${data.name}\n💆‍♂️ Услуга: ${data.massage}\n📅 Дата: ${data.date}\n⏰ Время: ${data.time}\n📞 Телефон: ${data.phone}`
            );
        } catch (e) {
            await ctx.reply("Произошла ошибка при обработке данных 😢");
        }
    }
});

export default bot;
