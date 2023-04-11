// import Twit from "twit";

// export class TwitterApi {
//     T: Twit;
//     constructor(consumer_key: string, consumer_secret: string, access_token: string, access_token_secret: string) {
//         this.T = new Twit({
//             consumer_key: consumer_key,
//             consumer_secret: consumer_secret,
//             access_token: access_token,
//             access_token_secret: access_token_secret,
//             timeout_ms: 60 * 1000,
//             strictSSL: true,
//             app_only_auth: true,
//         });
//     }
//     // async verifyCredentials() {
//     //     // Twit has promise support; you can use the callback API,
//     //     // promise API, or both at the same time.
//     //     //
//     //     this.T.get("account/verify_credentials", { skip_status: true })
//     //         .catch(function (err) {
//     //             console.log("caught error", err.stack);
//     //         })
//     //         .then(function (result) {
//     //             // `result` is an Object with keys "data" and "resp".
//     //             // `data` and `resp` are the same objects as the ones passed
//     //             // to the callback.
//     //             // See https://github.com/ttezel/twit#tgetpath-params-callback
//     //             // for details.

//     //             console.log("data", result?.data);
//     //         });
//     // }
//     // Получение списка подписчиков
//     async getFollowers(user: string) {
//         try {
//             console.log("Получение списка подписчиков");
//             const followers = await this.T.get("followers/list", { screen_name: user });
//             console.log(followers);
//             const followersList = (followers.data as any).users;
//             for (let i = 0; i < followersList.length; i++) {
//                 console.log(followersList[i].screen_name);
//             }
//         } catch (error) {
//             console.log("Ошибка:", error);
//         }
//     }
// }
