import { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } from "../../const";

import crypto from "crypto-js";
import oauth1a from "oauth-1.0a";

export class Oauth1Helper {
    static getAuthHeaderForRequest(request) {
        console.log({ key: TWITTER_CONSUMER_KEY, secret: TWITTER_CONSUMER_SECRET });
        const oauth = new oauth1a({
            consumer: { key: TWITTER_CONSUMER_KEY, secret: TWITTER_CONSUMER_SECRET },
            signature_method: "HMAC-SHA1",
            hash_function(base_string, key) {
                return crypto.algo.HMAC.create(crypto.algo.SHA1, key).update(base_string).finalize().toString(crypto.enc.Base64);
            },
        });
        console.log(request);
        const authorization = oauth.authorize(request);

        return oauth.toHeader(authorization);
    }
    static getAuthHeaderForAuthUserRequest(request, authToken, authToken_secret) {
        console.log({ key: TWITTER_CONSUMER_KEY, secret: TWITTER_CONSUMER_SECRET });
        const oauth = new oauth1a({
            consumer: { key: TWITTER_CONSUMER_KEY, secret: TWITTER_CONSUMER_SECRET },

            signature_method: "HMAC-SHA1",
            hash_function(base_string, key) {
                return crypto.algo.HMAC.create(crypto.algo.SHA1, key).update(base_string).finalize().toString(crypto.enc.Base64);
            },
        } as any);
        console.log("getAuthHeaderForAuthUserRequest:", request);
        const authorization = oauth.authorize(request, {
            key: authToken,
            secret: authToken_secret,
        });

        return oauth.toHeader(authorization);
    }
}
