import { TgBot } from "./bot/bot";
import { connectDB } from "./middleware/db";

const bot = new TgBot();
connectDB().then(async () => {
    bot.init();
});
