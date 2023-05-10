import mongoose, { Document, Model, ObjectId, Schema, model } from "mongoose";

import { notifyPeriod } from "../const";

export interface IUser extends Document {
    id: number;
    balance: number;
    //вступить в телеграм канал
    //вступить в телеграм чат
    //подписаться на твиттер
    //сделать ретвит в твиттере
    //подписаться на медиум
    //подписаться на ютуб
    isJoinToChannel: boolean;
    isJoinToChat: boolean;
    isSubscribeToTwitter: boolean;
    isRetweetToTwitter: boolean;
    isSubscribeToMedium: boolean;
    isSubscribeToYoutube: boolean;
    agreement: boolean;
    lastAction: number;
    actionStatus: boolean;
    lastGetBonus: number;
    lastNotification: number;
}
console.log("notifyPeriod:", notifyPeriod);
console.log("nt:", Date.now() / 1000 - notifyPeriod - 10);
const UserSchema = new Schema({
    id: {
        type: Number,
    },
    lastNotification: {
        type: Number,
        default: 0,
    },
    lastGetBonus: {
        type: Number,
        default: Date.now() / 1000 - notifyPeriod - 10,
    },
    lastAction: {
        type: Number,
        default: 0,
    },
    actionStatus: {
        type: Boolean,
        default: false,
    },
    agreement: {
        type: Boolean,
        default: false,
    },
    balance: {
        type: Number,
        default: 0,
    },
    isJoinToChannel: {
        type: Boolean,
        default: false,
    },
    isJoinToChat: {
        type: Boolean,
        default: false,
    },
    isSubscribeToTwitter: {
        type: Boolean,
        default: false,
    },
    isRetweetToTwitter: {
        type: Boolean,
        default: false,
    },
    isSubscribeToMedium: {
        type: Boolean,
        default: false,
    },
    isSubscribeToYoutube: {
        type: Boolean,
        default: false,
    },
});
const User = model<IUser>("user", UserSchema);

export default User;
