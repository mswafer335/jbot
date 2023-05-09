import * as dotenv from "dotenv";

import { BOT_TOKEN, SERVER_ADDRESS, TG_CHANNEL, TG_CHAT, TWITTER_CALLBACK_URL, TWITTER_CHANNEL, port } from "../const";
import { Extra, Markup, Telegraf } from "telegraf";
import { addBalance, getOrCreateUser } from "../dbLayer/user.base.db";
import {
    checkJoinToChannel,
    checkJoinToChat,
    checkRetweetToTwitter,
    checkSubscribeToMedium,
    checkSubscribeToTwitter,
    checkSubscribeToYoutube,
    switchEmulateSubJoinToChannel,
    switchEmulateSubJoinToChat,
    switchEmulateSubRetweetToTwitter,
    switchEmulateSubSubscribeToMedium,
    switchEmulateSubSubscribeToTwitter,
    switchEmulateSubSubscribeToYoutube,
} from "../subscribe/sub";

import Action from "../model/action";
import { CronJob } from "cron";
import { TelegrafContext } from "telegraf/typings/context";
import User from "../model/user";
import { actions } from "..";
import { encodeTGID } from "../crypto/crypto";
import mongoose from "mongoose";

dotenv.config();
if (!process.env.BOT_TOKEN) {
    console.error("Run: BOT_TOKEN not found");
    process.exit();
}

const ObjectId = mongoose.Types.ObjectId;
export class TgBot {
    bot: Telegraf<TelegrafContext>;
    constructor() {
        this.bot = new Telegraf(BOT_TOKEN!);
    }
    async cron() {
        const runner = new CronJob("*/1 * * * *", async () => {
            //every minute
            //   console.log("cron");
            const usersForNotify = await User.find({
                actionStatus: true,
                lastAction: { $lte: Date.now() / 1000 },
            });
            //find users and update

            for (const user of usersForNotify) {
                await this.bot.telegram.sendMessage(user.id, `Бонус!`);
                user.actionStatus = false;
                await user.save();
            }
        });
        runner.start();
    }
    async getReplyKeyboard(userId) {
        const user = await getOrCreateUser(userId);
        const sId = user.id.toString();
        const markup = Extra.HTML().markup((m) =>
            m.inlineKeyboard(
                //вступить в телеграм канал
                //вступить в телеграм чат
                //подписаться на твиттер
                //сделать ретвит в твиттере
                //подписаться на медиум
                //подписаться на ютуб
                [
                    [
                        m.urlButton(this.isActive("вступить в телеграм канал", user.isJoinToChannel), TG_CHANNEL!),
                        m.callbackButton(`проверить подписку`, `check_sub_to_channel`),
                    ],
                    [
                        m.urlButton(this.isActive("вступить в телеграм чат", user.isJoinToChat), TG_CHAT!),
                        m.callbackButton(`проверить подписку`, `check_sub_to_chat`),
                    ],
                    [
                        m.urlButton(this.isActive("подписаться на твиттер", user.isSubscribeToTwitter), TWITTER_CHANNEL!),
                        m.urlButton(`проверить подписку`, TWITTER_CALLBACK_URL + `u/${encodeTGID(sId)}`),
                    ],
                    [
                        m.urlButton(
                            this.isActive("сделать ретвит в твиттере", user.isRetweetToTwitter),
                            SERVER_ADDRESS + "/api/v1/twitter" + `?id=${user.id}`
                        ),
                        m.callbackButton(`проверить подписку`, `check_ret_to_twitter`),
                    ],
                    [
                        m.urlButton(
                            this.isActive("подписаться на медиум", user.isSubscribeToMedium),
                            SERVER_ADDRESS + "/api/v1/medium" + `?id=${user.id}`
                        ),
                        m.callbackButton(`проверить подписку`, `check_sub_to_medium`),
                    ],
                    [
                        m.urlButton(
                            this.isActive("подписаться на ютуб", user.isSubscribeToYoutube),
                            SERVER_ADDRESS + "/api/v1/youtube" + `?id=${user.id}`
                        ),
                        m.callbackButton(`проверить подписку`, `check_sub_to_youtube`),
                    ],
                ],

                {}
            )
        );
        return markup;
    }
    async sendMessageToUserID(userId: number, text: string) {
        await this.bot.telegram.sendMessage(userId, text, await this.getReplyKeyboard(userId));
    }
    isActive(s: string, b: boolean): string {
        s += "\n";
        return b ? `✅ ${s}` : `❌ ${s}`;
    }
    getSenderId(ctx: TelegrafContext) {
        //  console.log("ctx. ", ctx);
        const id = ctx.message?.from?.id || ctx.update.callback_query?.from?.id || ctx.update.message?.from?.id;
        //   console.log("id:", id);
        return id;
    }
    async actionRouter(ctx: TelegrafContext) {
        if (!ctx.chat?.id) {
            return await ctx.reply(`произошла ошибка. обратитесь к техподдержке.`);
        }
        if (!ctx.callbackQuery || !ctx.callbackQuery.data) return;
        // console.log("ctx.msg", ctx.callbackQuery);
        //   if (ctx.callbackQuery.data.startsWith("l_list_")) return this.listLootbox(ctx, ctx.callbackQuery.data.split("l_list_")[1]);
    }
    async menu(ctx: TelegrafContext) {
        const user = await getOrCreateUser(this.getSenderId(ctx));
        const markup = Extra.HTML().markup((m) =>
            m.inlineKeyboard(
                [[m.callbackButton(`Выполнить задания`, "subcribe")]],

                {}
            )
        );
        await ctx.reply(`Профиль:\nБаланс:${user.balance}`, markup);
    }
    async subscribe(ctx: TelegrafContext) {
        const user = await getOrCreateUser(this.getSenderId(ctx));
        const sId = user.id.toString();
        const markup = Extra.HTML().markup((m) =>
            m.inlineKeyboard(
                //вступить в телеграм канал
                //вступить в телеграм чат
                //подписаться на твиттер
                //сделать ретвит в твиттере
                //подписаться на медиум
                //подписаться на ютуб
                [
                    [
                        m.urlButton(this.isActive("вступить в телеграм канал", user.isJoinToChannel), TG_CHANNEL!),
                        m.callbackButton(`проверить подписку`, `check_sub_to_channel`),
                    ],
                    [
                        m.urlButton(this.isActive("вступить в телеграм чат", user.isJoinToChat), TG_CHAT!),
                        m.callbackButton(`проверить подписку`, `check_sub_to_chat`),
                    ],
                    [
                        m.urlButton(this.isActive("подписаться на твиттер", user.isSubscribeToTwitter), TWITTER_CHANNEL!),
                        m.urlButton(`проверить подписку`, TWITTER_CALLBACK_URL + `u/${encodeTGID(sId)}`),
                    ],
                    [
                        m.urlButton(
                            this.isActive("сделать ретвит в твиттере", user.isRetweetToTwitter),
                            SERVER_ADDRESS + "/api/v1/twitter" + `?id=${user.id}`
                        ),
                        m.callbackButton(`проверить подписку`, `check_ret_to_twitter`),
                    ],
                    [
                        m.urlButton(
                            this.isActive("подписаться на медиум", user.isSubscribeToMedium),
                            SERVER_ADDRESS + "/api/v1/medium" + `?id=${user.id}`
                        ),
                        m.callbackButton(`проверить подписку`, `check_sub_to_medium`),
                    ],
                    [
                        m.urlButton(
                            this.isActive("подписаться на ютуб", user.isSubscribeToYoutube),
                            SERVER_ADDRESS + "/api/v1/youtube" + `?id=${user.id}`
                        ),
                        m.callbackButton(`проверить подписку`, `check_sub_to_youtube`),
                    ],
                ],

                {}
            )
        );
        return await ctx.reply(`Подписки`, markup);
    }

    //async
    async init() {
        try {
            this.cron();
            this.bot.use(async (ctx, next) => {
                //   console.log("ctx: ", ctx);
                const sender = this.getSenderId(ctx);
                //console.log({ sender });
                const user = await getOrCreateUser(sender);
                user.lastAction = Date.now() / 1000 + 60 * 60 * 24;
                user.actionStatus = true;
                await user.save();
                return next();
            });
            this.bot.command("quit", async (ctx) => {
                // Explicit usage
                await ctx.telegram.leaveChat(this.getSenderId(ctx));

                // Using context shortcut
                await ctx.leaveChat();
            });

            this.bot.command("start", async (ctx) => {
                //console.log(ctx!.chat!.id);
                const sender = this.getSenderId(ctx);
                //console.log({ sender });
                const user = await getOrCreateUser(sender);
                if (!user.agreement) {
                    const markup = Extra.HTML().markup((m) =>
                        m.inlineKeyboard(
                            [[m.callbackButton(`Выполнить задания`, "subcribe")]],

                            {}
                        )
                    );
                    user.agreement = true;
                    await user.save();
                    await addBalance(user.id, 1000);
                    return await ctx.reply(
                        `Привет. За регистрацию вам начислено $1000 на стейкинг. чтобы получить этот приз и поучаствовать в его розыгрыше - нужно выполнить задания.`,
                        markup
                    );
                }
                this.menu(ctx);
            });
            this.bot.action("subcribe", async (ctx) => this.subscribe(ctx));

            this.bot.command("subscribe", async (ctx) => this.subscribe(ctx));
            //generate handlers action for check_sub
            this.bot.action("check_sub_to_channel", async (ctx) => {
                const findAction = await Action.findOne({ id: this.getSenderId(ctx), action: actions.tg_channel });

                const user = await getOrCreateUser(this.getSenderId(ctx));
                if (user.isJoinToChannel) {
                    if (!findAction) {
                        const action = new Action({
                            id: this.getSenderId(ctx),
                            action: actions.tg_channel,
                        });
                        await action.save();
                    }
                    return await ctx.reply("Вы уже подписаны на телеграм канал", await this.getReplyKeyboard(user.id));
                }
                const checkApi = await checkJoinToChannel(ctx, this.getSenderId(ctx));
                if (checkApi) {
                    if (!findAction) {
                        const action = new Action({
                            id: this.getSenderId(ctx),
                            action: actions.tg_channel,
                        });
                        await action.save();
                    }
                    user.isJoinToChannel = true;
                    await user.save();
                    return await ctx.reply("Вы подписались на телеграм канал!", await this.getReplyKeyboard(user.id));
                }
                const markup = Extra.HTML().markup((m) =>
                    m.inlineKeyboard(
                        [
                            m.urlButton(this.isActive("вступить в телеграм канал", user.isJoinToChannel), TG_CHANNEL!),
                            m.callbackButton(`проверить подписку`, `check_sub_to_channel`),
                        ],
                        {}
                    )
                );
                return await ctx.reply(`вы еще не подписаны на телеграм канал`, markup);
            });
            this.bot.action("check_sub_to_chat", async (ctx) => {
                const findAction = await Action.findOne({ id: this.getSenderId(ctx), action: actions.tg_chat });
                const user = await getOrCreateUser(this.getSenderId(ctx));
                if (user.isJoinToChat) {
                    if (!findAction) {
                        const action = new Action({
                            id: this.getSenderId(ctx),
                            action: actions.tg_chat,
                        });
                        await action.save();
                    }
                    return await ctx.reply("Вы уже подписаны на телеграм чат", await this.getReplyKeyboard(user.id));
                }
                const checkApi = await checkJoinToChat(ctx, this.getSenderId(ctx));
                if (checkApi) {
                    if (!findAction) {
                        const action = new Action({
                            id: this.getSenderId(ctx),
                            action: actions.tg_chat,
                        });
                        await action.save();
                    }
                    user.isJoinToChat = true;
                    await user.save();
                    return await ctx.reply("Вы подписались телеграм чат!", await this.getReplyKeyboard(user.id));
                }
                const markup = Extra.HTML().markup((m) =>
                    m.inlineKeyboard(
                        [
                            m.urlButton(this.isActive("вступить в телеграм чат", user.isJoinToChat), TG_CHAT!),
                            m.callbackButton(`проверить подписку`, `check_sub_to_chat`),
                        ],
                        {}
                    )
                );
                return await ctx.reply(`вы еще не подписаны на телеграм чат`, markup);
            });
            this.bot.action("check_sub_to_twitter", async (ctx) => {
                const findAction = await Action.findOne({ id: this.getSenderId(ctx), action: actions.twitter_channel });
                const user = await getOrCreateUser(this.getSenderId(ctx));
                if (user.isSubscribeToTwitter) {
                    if (!findAction) {
                        const action = new Action({
                            id: this.getSenderId(ctx),
                            action: actions.tg_chat,
                        });
                        await action.save();
                    }
                    return await ctx.reply("Вы уже подписаны на твиттер", await this.getReplyKeyboard(user.id));
                }
                const checkApi = await checkSubscribeToTwitter(this.getSenderId(ctx));
                if (checkApi) {
                    if (!findAction) {
                        const action = new Action({
                            id: this.getSenderId(ctx),
                            action: actions.tg_chat,
                        });
                        await action.save();
                    }
                    user.isSubscribeToTwitter = true;
                    await user.save();
                    return await ctx.reply("Вы уже подписаны на твиттер", await this.getReplyKeyboard(user.id));
                }
                const markup = Extra.HTML().markup((m) =>
                    m.inlineKeyboard([
                        m.urlButton(
                            this.isActive("подписаться на  твиттер", user.isSubscribeToTwitter),
                            SERVER_ADDRESS + "/api/v1/twitter" + `?id=${user.id}`
                        ),
                        m.callbackButton(`проверить подписку`, `check_sub_to_twitter`),
                    ])
                );
                return await ctx.reply(`вы еще не подписаны на твиттер`, markup);
            });
            this.bot.action("check_ret_to_twitter", async (ctx) => {
                const user = await getOrCreateUser(this.getSenderId(ctx));
                if (user.isRetweetToTwitter) {
                    return await ctx.reply("Вы уже ретвитнули", await this.getReplyKeyboard(user.id));
                }
                const checkApi = await checkRetweetToTwitter(this.getSenderId(ctx));
                if (checkApi) {
                    user.isRetweetToTwitter = true;
                    await user.save();
                    return await ctx.reply("Вы уже подписаны на твиттер", await this.getReplyKeyboard(user.id));
                }
                const markup = Extra.HTML().markup((m) =>
                    m.inlineKeyboard(
                        [
                            m.urlButton(this.isActive("сделать ретвит в твиттер", user.isRetweetToTwitter), "https://t.me/"),
                            m.callbackButton(`проверить подписку`, `check_ret_to_twitter`),
                        ],
                        {}
                    )
                );
                return await ctx.reply(`вы еще не подписаны на твиттер`, markup);
            });
            this.bot.action("check_sub_to_medium", async (ctx) => {
                const user = await getOrCreateUser(this.getSenderId(ctx));
                if (user.isSubscribeToMedium) {
                    return await ctx.reply("Вы уже подписаны на медиум", await this.getReplyKeyboard(user.id));
                }
                const checkApi = await checkSubscribeToMedium(this.getSenderId(ctx));
                if (checkApi) {
                    user.isSubscribeToMedium = true;
                    await user.save();
                    return await ctx.reply("Вы уже подписаны на медиум", await this.getReplyKeyboard(user.id));
                }
                const markup = Extra.HTML().markup((m) =>
                    m.inlineKeyboard(
                        [
                            m.urlButton(this.isActive("подписаться на медиум", user.isSubscribeToMedium), "https://t.me/"),
                            m.callbackButton(`проверить подписку`, `check_sub_to_medium`),
                        ],
                        {}
                    )
                );
                return await ctx.reply(`вы еще не подписаны на медиум`, markup);
            });
            this.bot.action("check_sub_to_youtube", async (ctx) => {
                const user = await getOrCreateUser(this.getSenderId(ctx));
                if (user.isSubscribeToYoutube) {
                    return await ctx.reply("Вы уже подписаны на ютуб", await this.getReplyKeyboard(user.id));
                }
                const checkApi = await checkSubscribeToYoutube(this.getSenderId(ctx));
                if (checkApi) {
                    user.isSubscribeToYoutube = true;
                    await user.save();
                    return await ctx.reply("Вы уже подписаны на ютуб", await this.getReplyKeyboard(user.id));
                }
                const markup = Extra.HTML().markup((m) =>
                    m.inlineKeyboard(
                        [
                            m.urlButton(
                                this.isActive("подписаться на ютуб", user.isSubscribeToYoutube),
                                SERVER_ADDRESS + "/api/v1/youtube" + `?id=${user.id}`
                            ),
                            m.callbackButton(`проверить подписку`, `check_sub_to_youtube`),
                        ],
                        {}
                    )
                );
                return await ctx.reply(`вы еще не подписаны на ютуб`, markup);
            });
            this.bot.command("id", async (ctx) => {
                ctx.reply(`${ctx.chat?.id || `id не найден`}`);
            });
            this.bot.command("e", async (ctx) => {
                const user = await getOrCreateUser(this.getSenderId(ctx));

                // эмуляция подписки
                //вступить в телеграм канал
                //вступить в телеграм чат
                //подписаться на твиттер
                //сделать ретвит в твиттере
                //подписаться на медиум
                //подписаться на ютуб
                const markup = Extra.HTML().markup((m) =>
                    m.inlineKeyboard(
                        [
                            [m.callbackButton(this.isActive("вступить в телеграм канал", user.isJoinToChannel), `emul_sub_to_channel`)],
                            [m.callbackButton(this.isActive("вступить в телеграм чат", user.isJoinToChat), `emul_sub_to_chat`)],
                            [m.callbackButton(this.isActive("подписаться на твиттер", user.isSubscribeToTwitter), `emul_sub_to_twitter`)],
                            [m.callbackButton(this.isActive("сделать ретвит в твиттере", user.isRetweetToTwitter), `emul_ret_to_twitter`)],
                            [m.callbackButton(this.isActive("подписаться на медиум", user.isSubscribeToMedium), `emul_sub_to_medium`)],
                            [m.callbackButton(this.isActive("подписаться на ютуб", user.isSubscribeToYoutube), `emul_sub_to_youtube`)],
                        ],
                        {}
                    )
                );
                await ctx.reply(`эмуляция подписки`, markup);
            });
            //generate handles for all emulate actions
            this.bot.action("emul_sub_to_channel", async (ctx) => {
                switchEmulateSubJoinToChannel(this.getSenderId(ctx));
                await ctx.reply(`Вступил в телеграм канал`);
            });
            this.bot.action("emul_sub_to_chat", async (ctx) => {
                switchEmulateSubJoinToChat(this.getSenderId(ctx));
                await ctx.reply(`Вступил в телеграм чат`);
            });
            this.bot.action("emul_sub_to_twitter", async (ctx) => {
                switchEmulateSubSubscribeToTwitter(this.getSenderId(ctx));
                await ctx.reply(`Вступил в твиттер`);
            });
            this.bot.action("emul_ret_to_twitter", async (ctx) => {
                switchEmulateSubRetweetToTwitter(this.getSenderId(ctx));
                await ctx.reply(`ретвитнул в твиттер`);
            });
            this.bot.action("emul_sub_to_medium", async (ctx) => {
                switchEmulateSubSubscribeToMedium(this.getSenderId(ctx));
                await ctx.reply(`Вступил в медиум`);
            });
            this.bot.action("emul_sub_to_youtube", async (ctx) => {
                switchEmulateSubSubscribeToYoutube(this.getSenderId(ctx));
                await ctx.reply(`Вступил в ютуб`);
            });
            //listen post on channel
            this.bot.on("channel_post", async (ctx) => {
                //print post text
                const text = (ctx.update.channel_post as any).text as string;
                // console.log("ctx.msg", (ctx?.update?.channel_post as any).text);
                if (text == "/id") {
                    return await ctx.reply(`${ctx.chat?.id || `id не найден`}`);
                }
            });
            // this.bot.hears(/.*/, async (ctx) => {
            //     // // Explicit usage
            //     // await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);
            //     console.log("ctx.msg", ctx.message?.text);
            //     // Using context shortcut
            //     await ctx.reply(`Hello `);
            // });

            this.bot.action("menu", async (ctx) => this.menu(ctx));
            // this.bot.action("all subs", (ctx) => this.allSubsEvent(ctx));

            this.bot.action(/.*/, async (ctx) => this.actionRouter(ctx));
            // this.bot.hears(/.*/, async (ctx) => {
            //     if (!ctx.message!.reply_to_message) return;
            //     const reply = (ctx.message!.reply_to_message! as any).text as string;
            //     const msg = ctx.message?.text as string;
            //     if (reply.includes("ссылку на лутбокс")) return this.subscribeToLootbox(ctx, msg, reply);
            //     console.log("ctx.msg", ctx.message?.text);

            //     await ctx.reply(`Hello`);
            // });
            // this.bot.on("callback_query", async (ctx) => {
            //     // Using context shortcut
            //     await ctx.answerCbQuery("kek");
            // });

            // this.bot.on("inline_query", async (ctx) => {

            //     // Using context shortcut
            //     await ctx.answerInlineQuery("result");
            // });

            this.bot.launch();
            console.log("Bot started");
        } catch (error) {
            console.log(error);
        }
    }
}
