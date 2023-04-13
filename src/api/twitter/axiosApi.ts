import { TWITTER_CALLBACK_URL, TWITTER_CHANNEL_USERNAME } from "../../const";

import { Oauth1Helper } from "./oauth";
import axios from "axios";
import { isNull } from "lodash";

function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === "?" ? queryString.substr(1) : queryString).split("&");
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split("=");
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
    }
    return query;
}
export async function axiosRequestAccessToken(oauth_token, oauth_verifier: string) {
    try {
        const request = {
            method: "POST",
            url: `https://api.twitter.com/oauth/access_token?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`,

            // params: {
            //     oauth_token: oauth_token,
            //     oauth_verifier: oauth_verifier,
            // },
            body: {},
        };

        const authHeader = Oauth1Helper.getAuthHeaderForRequest(request);
        //  console.log("authHeader", authHeader);
        const headers = {
            headers: authHeader,
        };
        //console.log(`hrs: `, headers);
        const result = await axios.post(request.url, request.body, headers as any);

        if (result.data) {
            if (result.data.error) {
                console.log(result.data.error);
                return null;
            }
            //  console.log("axiosRequestAccessToken> result.data", result.data);
            const parseQueryresult = parseQuery(result.data);
            return parseQueryresult;
        }
    } catch (error) {
        console.error(`[axiosRequestToken] (${error})`);
    }

    return null;
}
export async function axiosRequestToken() {
    try {
        const request = {
            url: `https://api.twitter.com/oauth/request_token`,
            params: { oauth_callback: TWITTER_CALLBACK_URL },
            method: "POST",
            body: {},
        };

        const authHeader = Oauth1Helper.getAuthHeaderForRequest(request);
        // console.log("authHeader", authHeader);
        const headers = {
            headers: authHeader,
        };
        //console.log(`hrs: `, headers);
        const result = await axios.post(request.url, request.body, headers as any);

        if (result.data) {
            if (result.data.error) {
                console.log(result.data.error);
                return null;
            }
            const parseQueryresult = parseQuery(result.data);
            return parseQueryresult;
        }
    } catch (error) {
        console.error(`[axiosRequestToken] (${error})`);
    }

    return null;
}
export async function axiosCheckSubcribe(access_token, access_token_secret, userName, targetName): Promise<boolean | null> {
    try {
        const request = {
            url: `https://api.twitter.com/1.1/friendships/show.json?source_screen_name=${userName}&target_screen_name=${targetName}`,

            method: "GET",
        };
        const authHeader = Oauth1Helper.getAuthHeaderForAuthUserRequest(request, access_token, access_token_secret);
        const headers = {
            headers: authHeader,
        };
        const result = await axios.get(request.url, headers as any);
        if (result.data) {
            if (result.data.error) {
                console.log(result.data.error);
                // return null;
            }
            console.log("axiosCheckSubcribe> result.data", result.data);
            //  const parseQueryresult = parseQuery(result.data);
            const sRaw = result.data?.relationship?.source?.following;
            if (isNull(sRaw)) {
                return null;
            }

            return sRaw;
        }
    } catch (error) {
        console.error(`[axiosGetUserSubscriptions] (${error})`);
        return null;
    }
    return null;
}
