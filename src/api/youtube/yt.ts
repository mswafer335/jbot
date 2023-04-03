import { ACCESS_TOKEN, CLIENT_ID, CLIENT_SECRET, REDIRECT_URL } from "../../const";

const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");

// Создаем OAuth 2.0 client
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

// Получаем OAuth 2.0 access token
export async function getAccessToken() {
    const { tokens } = await oauth2Client.getToken(ACCESS_TOKEN);
    oauth2Client.setCredentials(tokens);
}

// Получаем список подписчиков канала
export async function getSubscribers() {
    // const youtube = google.youtube({
    //     version: "v3",
    //     auth: oauth2Client,
    // });
    // const res = await youtube.subscriptions.list({
    //     part: "snippet",
    //     mine: true,
    //     maxResults: 50,
    // });
    // console.log(res.data.items);
}
