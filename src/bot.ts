import { Telegraf, Markup } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";
import { config } from "./config";

const bot = new Telegraf(config.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply(
        "Добро пожаловать! Вы можете записаться на массаж:",
        Markup.keyboard([
            Markup.button.webApp(
                "🗓 Записаться",
                "https://massagebook-web.vercel.app"
            ),
            Markup.button.text("📋 Мои записи"),
        ])
            .resize()
            .oneTime()
    );
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
