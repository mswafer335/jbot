import { getAccessToken, getSubscribers } from "./api/youtube/yt";
import { TgBot } from "./bot/bot";
import { connectDB } from "./middleware/db";

const bot = new TgBot();
connectDB().then(async () => {
    bot.init();
});

// // Вызываем функцию для получения access token и списка подписчиков
// async function main() {
//     await getAccessToken();
//     await getSubscribers();
// }

// main();
