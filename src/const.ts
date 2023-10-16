import * as dotenv from "dotenv";
// export const notifyPeriod = 60 * 1000;
export const notifyPeriod = 8 * 60 * 60 * 1000;
console.log(`Bot notifyPeriod: ${notifyPeriod}`);
//dotenv.config({ path: "./.env", debug: true });
dotenv.config();
//console.log(process.env);
export const port = process.env.PORT;

export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;

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
// if (!CLIENT_ID) {
//     console.error("Run: CLIENT_ID not found");
//     process.exit(1);
// }
// if (!CLIENT_SECRET) {
//     console.error("Run: CLIENT_SECRET not found");
//     process.exit(1);
// }
// if (!REDIRECT_URL) {
//     console.error("Run: REDIRECT_URL not found");
//     process.exit(1);
// }
// if (!BOT_TOKEN) {
//     console.error("Run: BOT_TOKEN not found");
//     process.exit(1);
// }
// if (!ACCESS_TOKEN) {
//     console.error("Run: ACCESS_TOKEN not found");
//     process.exit(1);
// }
// if (!REFRESH_TOKEN) {
//     console.error("Run: REFRESH_TOKEN not found");
//     process.exit(1);
// // }
// if (!API_KEY) {
//     console.error("Run: API_KEY not found");
//     process.exit(1);
// }
// if (!CHANNEL_ID) {
//     console.error("Run: CHANNEL_ID not found");
//     process.exit(1);
// }
//twitter keys
//CONSUMER_KEY,CONSUMER_SECRET,ACCESS_TOKEN,ACCESS_TOKEN_SECRET
export const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY!;
if (!TWITTER_CONSUMER_KEY) {
    console.error("Run: TWITTER_CONSUMER_KEY not found");
    process.exit(1);
}
export const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET!;
if (!TWITTER_CONSUMER_SECRET) {
    console.error("Run: TWITTER_CONSUMER_SECRET not found");
    process.exit(1);
}

//TWITTER_CHANNEL_USERNAME
export const TWITTER_CHANNEL_USERNAME = process.env.TWITTER_CHANNEL_USERNAME!;
if (!TWITTER_CHANNEL_USERNAME) {
    console.error("Run: TWITTER_CHANNEL_USERNAME not found");
    process.exit(1);
}

//SECRET_FOR_ENCODE_TGID
export const SECRET_FOR_ENCODE_TGID = process.env.SECRET_FOR_ENCODE_TGID!;
if (!SECRET_FOR_ENCODE_TGID) {
    console.error("Run: SECRET_FOR_ENCODE_TGID not found");
    process.exit(1);
}
//server address

export let SERVER_ADDRESS = process.env.SERVER_ADDRESS;
if (!SERVER_ADDRESS || SERVER_ADDRESS == "") {
    console.error("Run: SERVER_ADDRESS not found");
    process.exit(1);
} else {
    if (SERVER_ADDRESS.endsWith("/")) {
        SERVER_ADDRESS = SERVER_ADDRESS.replace(/\/$/, "");
    }
}

export const REDIRECT_URL = SERVER_ADDRESS;
export const TWITTER_CALLBACK_URL = SERVER_ADDRESS + "/";
