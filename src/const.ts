import * as dotenv from "dotenv";
dotenv.config({ path: "./.env", debug: true });
//console.log(process.env);
export const port = process.env.PORT;
export const SERVER_ADDRESS = process.env.SERVER_ADDRESS;
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const REDIRECT_URL = process.env.REDIRECT_URL;
export const BOT_TOKEN = process.env.BOT_TOKEN;
export const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
export const API_KEY = process.env.API_KEY;
export const CHANNEL_ID = process.env.CHANNEL_ID;
//TG_CHAT,TG_CHANNEL
export const TG_CHAT = process.env.TG_CHAT;
export const TG_CHANNEL = process.env.TG_CHANNEL;
//TG_CHAT_ID,TG_CHANNEL_ID
export const TG_CHAT_ID = process.env.TG_CHAT_ID;
export const TG_CHANNEL_ID = process.env.TG_CHANNEL_ID;
export const MEDI_CHANNEL = process.env.MEDI_CHANNEL;
export const TWITTER_CHANNEL = process.env.TWITTER_CHANNEL;
export const YOUTUBE_CHANNEL = process.env.YOUTUBE_CHANNEL;
// //func check all const exist and not empty. else error and os.exit
// if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URL || !BOT_TOKEN || !ACCESS_TOKEN || !REFRESH_TOKEN) {
//     console.error("Run: CLIENT_ID, CLIENT_SECRET, REDIRECT_URL, BOT_TOKEN, ACCESS_TOKEN, REFRESH_TOKEN not found");
//     process.exit(1);
// }
if (!CLIENT_ID) {
    console.error("Run: CLIENT_ID not found");
    process.exit(1);
}
if (!CLIENT_SECRET) {
    console.error("Run: CLIENT_SECRET not found");
    process.exit(1);
}
if (!REDIRECT_URL) {
    console.error("Run: REDIRECT_URL not found");
    process.exit(1);
}
if (!BOT_TOKEN) {
    console.error("Run: BOT_TOKEN not found");
    process.exit(1);
}
// if (!ACCESS_TOKEN) {
//     console.error("Run: ACCESS_TOKEN not found");
//     process.exit(1);
// }
// if (!REFRESH_TOKEN) {
//     console.error("Run: REFRESH_TOKEN not found");
//     process.exit(1);
// }
if (!API_KEY) {
    console.error("Run: API_KEY not found");
    process.exit(1);
}
if (!CHANNEL_ID) {
    console.error("Run: CHANNEL_ID not found");
    process.exit(1);
}
