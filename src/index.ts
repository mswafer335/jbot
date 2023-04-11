import * as bodyParser from "body-parser";

import { MEDI_CHANNEL, SERVER_ADDRESS, TWITTER_CHANNEL, YOUTUBE_CHANNEL, port } from "./const";
import { axiosRequestAccessToken, axiosRequestToken } from "./api/twitter/axiosApi";
import express, { NextFunction, Request, Response } from "express";
import { getAccessToken, getSubscribers } from "./api/youtube/yt";

import Action from "./model/action";
import { TgBot } from "./bot/bot";
import User from "./model/user";
import axios from "axios";
import { connectDB } from "./middleware/db";
import cors from "cors";
import { idDto } from "./dto/id.dto";
import { loggerMiddleware } from "./middleware/api";
import path from "path";
import useragent from "express-useragent";
import { validationAndParseMiddleware } from "./middleware/validation";

const timeout = require("express-timeout-handler");
const app = express();
const options = {
    // Optional. This will be the default timeout for all endpoints.
    // If omitted there is no default timeout on endpoints
    timeout: 30000,

    // Optional. This function will be called on a timeout and it MUST
    // terminate the request.
    // If omitted the module will end the request with a default 503 error.
    onTimeout: function (req: any, res: any) {
        res.status(503).send("Service unavailable. timeout. Please retry.");
    },

    // Optional. Define a function to be called if an attempt to send a response
    // happens after the timeout where:
    // - method: is the method that was called on the response object
    // - args: are the arguments passed to the method
    // - requestTime: is the duration of the request
    // timeout happened
    onDelayedResponse: function (req: any, method: any, args: any, requestTime: any) {
        console.log(`Attempted to call ${method} after timeout`);
    },

    // Optional. Provide a list of which methods should be disabled on the
    // response object when a timeout happens and an error has been sent. If
    // omitted, a default list of all methods that tries to send a response
    // will be disable on the response object
    disable: ["write", "setHeaders", "send", "json", "end"],
};
app.use(timeout.handler(options));
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(useragent.express());
app.use(loggerMiddleware);
const bot = new TgBot();
connectDB().then(async () => {
    bot.init();
});
export enum actions {
    medium = "medium",
    twitter_channel = "twitter_channel",
    youtube_channel = "youtube_channel",
    tg_channel = "tg_channel",
    tg_chat = "tg_chat",
}
app.get("/api/v1/medium", validationAndParseMiddleware(idDto), async (req: Request, res: Response, next: NextFunction) => {
    res.redirect(MEDI_CHANNEL!);
    // console.log(req.body);
    const findAction = await Action.findOne({ id: req.body.id, action: actions.medium });
    if (findAction) {
        return;
    }
    const action = new Action({
        id: req.body.id,
        action: actions.medium,
    });
    await action.save();
    User.findOne({ id: req.body.id }).then((user) => {
        user!.isSubscribeToMedium = true;
        user!.save();
        bot.sendMessageToUserID(req.body.id, "Вы подписались на Medium!");
    });
});
app.get("/api/v1/twitter", validationAndParseMiddleware(idDto), async (req: Request, res: Response, next: NextFunction) => {
    res.redirect(TWITTER_CHANNEL!);
    // console.log(req.body);
    const findAction = await Action.findOne({ id: req.body.id, action: actions.twitter_channel });
    if (findAction) {
        return;
    }
    const action = new Action({
        id: req.body.id,
        action: actions.twitter_channel,
    });
    await action.save();
    User.findOne({ id: req.body.id }).then((user) => {
        user!.isSubscribeToTwitter = true;
        user!.save();
        bot.sendMessageToUserID(req.body.id, "Вы подписались на Twitter!");
    });
});
app.get("/api/v1/youtube", validationAndParseMiddleware(idDto), async (req: Request, res: Response, next: NextFunction) => {
    res.redirect(YOUTUBE_CHANNEL!);
    // console.log(req.body);
    const findAction = await Action.findOne({ id: req.body.id, action: actions.youtube_channel });
    if (findAction) {
        return;
    }
    const action = new Action({
        id: req.body.id,
        action: actions.youtube_channel,
    });
    await action.save();
    User.findOne({ id: req.body.id }).then((user) => {
        user!.isSubscribeToYoutube = true;
        user!.save();
        bot.sendMessageToUserID(req.body.id, "Вы подписались на YouTube!");
    });
});
app.get("/api/v1/status", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ status: "ok" });
});

app.post("/api/v1/request_tokens", async (req: Request, res: Response, next: NextFunction) => {
    //get userid from query params
    // const userid = parseInt(req.query.userid as string);
    // if (isNaN(userid)) {
    //     res.status(400).send({ status: "error", message: "userid is required, or userid broken" });
    //     return;
    // }
    const tokens = await axiosRequestToken();
    console.log(tokens);
    res.status(200).send({ status: "ok", tokens: tokens });
});
app.post("/api/v1/access_tokens", async (req: Request, res: Response, next: NextFunction) => {
    //get userid from query params
    // const userid = parseInt(req.query.userid as string);
    // if (isNaN(userid)) {
    //     res.status(400).send({ status: "error", message: "userid is required, or userid broken" });
    //     return;
    // }
    const oauth_token = req.query.oauth_token as string;
    const oauth_verifier = req.query.oauth_verifier as string;
    if (!oauth_token || !oauth_verifier) {
        res.status(400).send({ status: "error", message: "oauth_token or oauth_verifier is required" });
        return;
    }
    const tokens = await axiosRequestAccessToken(oauth_token, oauth_verifier);
    console.log("axiosRequestAccessToken> tokens:", tokens);
    res.status(200).send({ status: "ok", tokens: tokens });
});
app.get("/u/:id", (req: Request, res: Response, next: NextFunction) => {
    const pt = path.join(__dirname + "/user.html");
    res.sendFile(pt);
});
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    const pt = path.join(__dirname + "/index.html");
    res.sendFile(pt);
});
app.use(function (err: { status: any }, req: any, res: any, next: any) {
    console.log({ err });
    res.status(err.status || 500);
    res.end();
});
app.listen(port, () => {
    console.log(`[server]: Server is running at ${SERVER_ADDRESS}`);
});
// // Вызываем функцию для получения access token и списка подписчиков
// async function main() {
//     await getAccessToken();
//     await getSubscribers();
// }

// main();
