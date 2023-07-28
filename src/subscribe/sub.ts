// return ctx.message?.from?.id || ctx.callbackQuery?.message?.from?.id || ctx.update.callback_query?.from?.id || ctx.update.message?.from?.id;
//generate funct for this params
// isJoinToChannel: boolean;
// isJoinToChat: boolean;
// isSubscribeToTwitter: boolean;
// isRetweetToTwitter: boolean;
// isSubscribeToMedium: boolean;

import { TelegrafContext } from "telegraf/typings/context";
import { TG_CHANNEL, TG_CHANNEL_ID, TG_CHAT_ID } from "../const";

// isSubscribeToYoutube: boolean;
interface sub {
    isJoinToChannel: boolean;
    isJoinToChat: boolean;
    isSubscribeToTwitter: boolean;
    isRetweetToTwitter: boolean;
    isSubscribeToMedium: boolean;
    isSubscribeToYoutube: boolean;
}
const arrEmulateSubscribe = new Map<number, sub>();

export const checkJoinToChannel = async (ctx: TelegrafContext, id: number): Promise<boolean> => {
    try {
        const res = await ctx.telegram.getChatMember(TG_CHANNEL_ID!, id);
        console.log("res:", res);
        return res.status !== "left";
    } catch (e) {
        console.log(e);
        return false;
    }
};
export const checkJoinToChat = async (ctx: TelegrafContext, id: number) => {
    try {
        const res = await ctx.telegram.getChatMember(TG_CHAT_ID!, id);
        console.log("res:", res);
        return res.status !== "left";
    } catch (e) {
        console.log(e);
        return false;
    }
};
// export const checkSubscribeToTwitter = async (id: number): Promise<boolean> => {
//     if (arrEmulateSubscribe.has(id)) {
//         return arrEmulateSubscribe.get(id)!.isSubscribeToTwitter;
//     }
//     //TODO add real api
//     return false;
// };
// export const checkRetweetToTwitter = async (id: number): Promise<boolean> => {
//     if (arrEmulateSubscribe.has(id)) {
//         return arrEmulateSubscribe.get(id)!.isRetweetToTwitter;
//     }
//     //TODO add real api
//     return false;
// };
// export const checkSubscribeToMedium = async (id: number): Promise<boolean> => {
//     if (arrEmulateSubscribe.has(id)) {
//         return arrEmulateSubscribe.get(id)!.isSubscribeToMedium;
//     }
//     //TODO add real api
//     return false;
// };
// export const checkSubscribeToYoutube = async (id: number): Promise<boolean> => {
//     if (arrEmulateSubscribe.has(id)) {
//         return arrEmulateSubscribe.get(id)!.isSubscribeToYoutube;
//     }
//     //TODO add real api
//     return false;
// };
export const getOrCreateEmulateSub = (id: number) => {
    if (arrEmulateSubscribe.has(id)) {
        return arrEmulateSubscribe.get(id)!;
    }
    const sub: sub = {
        isJoinToChannel: false,
        isJoinToChat: false,
        isSubscribeToTwitter: false,
        isRetweetToTwitter: false,
        isSubscribeToMedium: false,
        isSubscribeToYoutube: false,
    };
    arrEmulateSubscribe.set(id, sub);
    return sub;
};
export const switchEmulateSubJoinToChannel = (id: number) => {
    getOrCreateEmulateSub(id);
    if (arrEmulateSubscribe.has(id)) {
        const sub = arrEmulateSubscribe.get(id)!;
        sub.isJoinToChannel = !sub.isJoinToChannel;
        arrEmulateSubscribe.set(id, sub);
    }
};
export const switchEmulateSubJoinToChat = (id: number) => {
    getOrCreateEmulateSub(id);
    if (arrEmulateSubscribe.has(id)) {
        const sub = arrEmulateSubscribe.get(id)!;
        sub.isJoinToChat = !sub.isJoinToChat;
        arrEmulateSubscribe.set(id, sub);
    }
};
export const switchEmulateSubSubscribeToTwitter = (id: number) => {
    getOrCreateEmulateSub(id);
    if (arrEmulateSubscribe.has(id)) {
        const sub = arrEmulateSubscribe.get(id)!;
        sub.isSubscribeToTwitter = !sub.isSubscribeToTwitter;
        arrEmulateSubscribe.set(id, sub);
    }
};
export const switchEmulateSubRetweetToTwitter = (id: number) => {
    getOrCreateEmulateSub(id);
    if (arrEmulateSubscribe.has(id)) {
        const sub = arrEmulateSubscribe.get(id)!;
        sub.isRetweetToTwitter = !sub.isRetweetToTwitter;
        arrEmulateSubscribe.set(id, sub);
    }
};
export const switchEmulateSubSubscribeToMedium = (id: number) => {
    getOrCreateEmulateSub(id);
    if (arrEmulateSubscribe.has(id)) {
        const sub = arrEmulateSubscribe.get(id)!;
        sub.isSubscribeToMedium = !sub.isSubscribeToMedium;
        arrEmulateSubscribe.set(id, sub);
    }
};
export const switchEmulateSubSubscribeToYoutube = (id: number) => {
    getOrCreateEmulateSub(id);
    if (arrEmulateSubscribe.has(id)) {
        const sub = arrEmulateSubscribe.get(id)!;
        sub.isSubscribeToYoutube = !sub.isSubscribeToYoutube;
        arrEmulateSubscribe.set(id, sub);
    }
};
