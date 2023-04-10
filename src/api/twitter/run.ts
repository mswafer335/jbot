import { TwitterApi } from "./twi";
import { TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET, TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, TWITTER_USER } from "./../../const";

async function runnerTwi() {
    console.log("Запуск программы");
    const twi = new TwitterApi(TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET, TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET);
    const u = await twi.getFollowers(TWITTER_USER);
}
runnerTwi();
