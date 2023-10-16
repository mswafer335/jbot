import * as bodyParser from "body-parser";

import { MEDI_CHANNEL, SERVER_ADDRESS, TWITTER_CHANNEL, TWITTER_CHANNEL_USERNAME, YOUTUBE_CHANNEL, port } from "./const";
import { axiosCheckSubcribe, axiosRequestAccessToken, axiosRequestToken } from "./api/twitter/axiosApi";
import express, { NextFunction, Request, Response } from "express";

import Action from "./model/action";
import { TgBot } from "./bot/bot";
import User from "./model/user";
import axios from "axios";
import { connectDB } from "./middleware/db";
import cors from "cors";
import { decodeTGID } from "./crypto/crypto";
import { idDto } from "./dto/id.dto";
import { isNull } from "lodash";
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
    retwit = "retwit",
}

app.get("/api/v1/status", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ status: "ok" });
});

app.get("/u/:id", async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const tgid = decodeTGID(id);
    //   console.log(tgid);
    if (!tgid) {
        res.status(400).send({ status: "error", message: "id is required" });
        return;
    }
    const pID = parseInt(tgid);
    if (isNaN(pID)) {
        res.status(400).send({ status: "error", message: "id is required" });
        return;
    }
    const user = await User.findOne({ id: pID });
    //console.log(`id: ${pID}`, user);
    if (!user) {
        res.status(400).send({ status: "error", message: "user not found" });
        return;
    }

    if (user.id !== pID) {
        res.status(400).send({ status: "error", message: "user not found" });
        return;
    }

    if (user.isSubscribeToTwitter == true) {
        return res.status(200).send("Вы уже подписались на Twitter!");
    }
    //console.log(user);
    const pt = path.join(__dirname + "/user.html");
    res.sendFile(pt);
});

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    const pt = path.join(__dirname + "/index.html");
    res.sendFile(pt);
});

app.get('/users/csv', async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();
    //convert to csv
    let csv = "id;username;weight;balance\n";
    users.forEach((user) => {
        //weight is sum of all booleans
        let weight = 0 + +user.isJoinToChannel + +user.isJoinToChat + +user.isSubscribeToMedium + +user.isSubscribeToYoutube + +user.isSubscribeToTwitter;
        csv += `${user.id};${user.username};${weight};${user.balance}\n`;
    }
    );
    res.setHeader('Content-disposition', 'attachment; filename=users.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);
});
app.use(function (err: { status: any }, req: any, res: any, next: any) {
    console.log({ err });
    res.status(err.status || 500);
    res.end();
});
app.listen(port, () => {
    console.log(`[server]: Server is running at ${SERVER_ADDRESS}`);
});
