import * as dotenv from "dotenv";

import { Extra, Markup, Telegraf } from "telegraf";

import { TelegrafContext } from "telegraf/typings/context";
import mongoose from "mongoose";

dotenv.config();
if (!process.env.BOT_TOKEN) {
    console.error("Run: BOT_TOKEN not found");
    process.exit();
}
const token = process.env.BOT_TOKEN;
const ObjectId = mongoose.Types.ObjectId;
export class TgBot {
    bot: Telegraf<TelegrafContext>;
    constructor() {
        this.bot = new Telegraf(token);
    }

    async actionRouter(ctx: TelegrafContext) {
        if (!ctx.chat?.id) {
            return await ctx.reply(`произошла ошибка. обратитесь к техподдержке.`);
        }
        if (!ctx.callbackQuery || !ctx.callbackQuery.data) return;
        // console.log("ctx.msg", ctx.callbackQuery);
        //   if (ctx.callbackQuery.data.startsWith("l_list_")) return this.listLootbox(ctx, ctx.callbackQuery.data.split("l_list_")[1]);
    }
    //async
    async init() {
        this.bot.command("quit", async (ctx) => {
            // Explicit usage
            await ctx.telegram.leaveChat(ctx.message!.chat.id);

            // Using context shortcut
            await ctx.leaveChat();
        });

        this.bot.command("start", async (ctx) => {
            // Explicit usage
            const markup = Extra.HTML().markup((m) =>
                m.inlineKeyboard(
                    [[m.callbackButton(`test button 1`, "subcribe")], [m.callbackButton(`test button 2`, "all subs")]],

                    {}
                )
            );
            await ctx.reply(`Привет. Я бот`, markup);
        });
        // this.bot.command("subscribe", async (ctx) => {
        //     //ctx.update.message.text. .split(" ");
        //     await ctx.reply(`Hello`);
        // });
        // this.bot.on(message("text"), async (ctx) => {
        //     // // Explicit usage
        //     // await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);

        //     // Using context shortcut
        //     await ctx.reply(`Hello ${ctx.state.role}`);
        // });

        this.bot.action("menu", async (ctx) => {
            // Explicit usage
            const markup = Extra.HTML().markup((m) =>
                m.inlineKeyboard(
                    [[m.callbackButton(`подписаться на лутбокс`, "subcribe")], [m.callbackButton(`все подписки`, "all subs")]],

                    {}
                )
            );
            await ctx.reply(`Меню:`, markup);
        });
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
    }
}
