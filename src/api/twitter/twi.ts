import Twit from "twit";

export class TwitterApi {
    T: Twit;
    constructor(consumer_key: string, consumer_secret: string, access_token: string, access_token_secret: string) {
        this.T = new Twit({
            consumer_key: consumer_key,
            consumer_secret: consumer_secret,
            access_token: access_token,
            access_token_secret: access_token_secret,
            timeout_ms: 60 * 1000,
            strictSSL: true,
        });
    }
    // Получение списка подписчиков
    async getFollowers(user: string) {
        try {
            console.log("Получение списка подписчиков");
            const followers = await this.T.get("followers/list", { screen_name: user });
            console.log(followers);
            const followersList = (followers.data as any).users;
            for (let i = 0; i < followersList.length; i++) {
                console.log(followersList[i].screen_name);
            }
        } catch (error) {
            console.log("Ошибка:", error);
        }
    }
}
