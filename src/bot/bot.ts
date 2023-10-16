import * as dotenv from "dotenv";

import { BOT_TOKEN, SERVER_ADDRESS, TG_CHANNEL, TG_CHAT, TWITTER_CALLBACK_URL, TWITTER_CHANNEL, notifyPeriod, port } from "../const";
import { Extra, Markup, Telegraf } from "telegraf";
import { addBalance, getOrCreateUser } from "../dbLayer/user.base.db";
import {
    checkJoinToChannel,
    checkJoinToChat,
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
            try {
                const usersForNotify = await User.find({
                    actionStatus: true,
                    agreement: true,
                    lastNotification: { $lte: Date.now()  - notifyPeriod },
                    // lastGetBonus: { $lte: Date.now()  - notifyPeriod, $gte: Date.now()  - notifyPeriod * 2 },
                    blocked: false,
                });
                //find users and update

                for (const user of usersForNotify) {
                    console.log(user.id);
                    const markup = Extra.HTML().markup((m) =>
                        m.inlineKeyboard(
                            [
                                //callback button "Получить бонус"
                                [
                                    {
                                        text: "Продолжить стейкинг",
                                        callback_data: "get_bonus",
                                    },
                                ],
                                // [
                                //     //callback menu
                                //     { text: "Меню", callback_data: "menu" },
                                // ],
                            ],

                            {}
                        )
                    );
                    try {
                        await this.bot.telegram.sendMessage(
                            user.id,
                            `Вам на стейкинг сегодня начислена награда в размере 1$. Чтобы забрать награду и претендовать на эирдроп, подтвердите стейкинг.`,
                            markup
                        );
                        user.actionStatus = false;
                        user.lastNotification = Date.now() ;
                        await user.save();
                    } catch (error) {
                        console.log(error);
                    }
                }

                const usersToBlock = await User.find({
                    agreement: true,
                    lastNotification: { $lte: Date.now()  - (notifyPeriod * 9) },
                    blocked: false,
                });
                for (const user of usersToBlock) {
                    try {
                        await this.bot.telegram.sendMessage(
                            user.id,
                            "Ваш аккаунт заблокирован. Причина: не подтвержденный стейкинг.",
                        );
                        user.balance = 0;
                        user.blocked = true;
                        await user.save();
                    } catch (error) {
                        console.log(error);
                    }
                }

            } catch (error) {
                console.log(error);
            }
        });
        runner.start();
    }

    isActive(s: string, b: boolean): string {
        s += "\n";
        return b ? `✅ ${s}` : `❌ ${s}`;
    }
    getSenderId(ctx: TelegrafContext) {
        //  console.log("ctx. ", ctx);
        const id = ctx.message?.from?.id || ctx.update.callback_query?.from?.id || ctx.update.message?.from?.id;
        const username = ctx.message?.from?.username || ctx.update.callback_query?.from?.username || ctx.update.message?.from?.username;
        //   console.log("id:", id);
        return { id, username };
    }
    async actionRouter(ctx: TelegrafContext) {
        if (!ctx.chat?.id) {
            return await ctx.reply(`произошла ошибка. обратитесь к техподдержке.`);
        }
        if (!ctx.callbackQuery || !ctx.callbackQuery.data) return;
        // console.log("ctx.msg", ctx.callbackQuery);
        //   if (ctx.callbackQuery.data.startsWith("l_list_")) return this.listLootbox(ctx, ctx.callbackQuery.data.split("l_list_")[1]);
    }
    // async menu(ctx: TelegrafContext) {
    //     const user = await getOrCreateUser(this.getSenderId(ctx));
    //     const markup = Extra.HTML().markup((m) =>
    //         m.inlineKeyboard(
    //             [[m.callbackButton(`Выполнить задания`, "subcribe")]],

    //             {}
    //         )
    //     );
    //     await ctx.reply(`Профиль:\nБаланс:${user.balance}`, markup);
    // }

    async init() {
        try {
            this.cron();
            this.bot.use(async (ctx, next) => {
                if (ctx.chat?.type != "private") {
                    if (ctx.message?.text == "/id") {
                        await ctx.reply(`id: ${ctx.chat?.id}`);
                        return;
                    }
                    const text = (ctx.update?.channel_post as any)?.text as string;
                    if (text == "/id") {
                        return await ctx.reply(`${ctx.chat?.id || `id не найден`}`);
                    }
                    return;
                }
                const sender = this.getSenderId(ctx);
                if (!sender || isNaN(sender.id)) {
                    return;
                }
                const user = await getOrCreateUser(sender);
                await user.save();
                return next();
            });

            this.bot.command("quit", async (ctx) => {
                await ctx.telegram.leaveChat(this.getSenderId(ctx).id);
                await ctx.leaveChat();
            });

            this.bot.command("start", async (ctx) => {
                const sender = this.getSenderId(ctx);
                const user = await getOrCreateUser(sender);
                if(user.blocked) {
                    return ctx.reply(`Вы заблокированы`);
                }
                if (!user.agreement) {
                    const markup = Extra.HTML().markup((m) =>
                        m.inlineKeyboard(
                            [[m.callbackButton(`Подтверждаю`, "agreement")]],

                            {}
                        )
                    );
                    return await ctx.reply(
                        `Привет. За регистрацию вам будет начислено $1000 на стейкинг. Подтвердите что вы согласны с условиями использования: ...................`,
                        markup
                    );
                }
                // this.menu(ctx);
            });

            this.bot.action("agreement", async (ctx) => {
                const user = await getOrCreateUser(this.getSenderId(ctx));
                if(user.agreement) {
                    return ctx.reply(`Вы уже подтвердили согласие с условиями использования`);
                }
                if(user.blocked) {
                    return ctx.reply(`Вы заблокированы`);
                }
                user.agreement = true;
                user.actionStatus = true;
                user.lastNotification = Date.now();
                user.lastAction = Date.now() + notifyPeriod;
                user.lastGetBonus = Date.now();
                await ctx.editMessageReplyMarkup();

                await user.save();
                await addBalance(user.id, 1000);
                return ctx.reply(`Спасибо. Теперь вы можете пользоваться ботом. Стейкинг надо подтверждать каждые 8 часов`);
            });

            this.bot.action("get_bonus", async (ctx) => {
                const user = await getOrCreateUser(this.getSenderId(ctx));
                let timeLeft = Date.now()  - notifyPeriod - user.lastGetBonus;
                if (timeLeft < 0) {
                    return await ctx.reply(`Вам уже начисляли $ в последние 8 часов. До следующего начисления осталось ${Math.round(Math.abs(timeLeft) / 1000)} секунд`);
                }
                if(user.blocked) {
                    return ctx.reply(`Вы заблокированы`);
                }
                await ctx.editMessageReplyMarkup();
                await ctx.deleteMessage();
                await addBalance(user.id, 1);
                user.actionStatus = true;
                user.lastGetBonus = Date.now() ;
                await user.save();
                return await ctx.reply(`Вам начислено $1 на стейкинг. Ваш текущий баланс ${user.balance + 1}`);
            });

            this.bot.command("id", async (ctx) => {
                ctx.reply(`${ctx.chat?.id || `id не найден`}`);
            });

            this.bot.action(/.*/, async (ctx) => this.actionRouter(ctx));

            this.bot.launch();
            console.log("Bot started");
        } catch (error) {
            console.log(error);
        }
    }
}
