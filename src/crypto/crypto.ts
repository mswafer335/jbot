import { SECRET_FOR_ENCODE_TGID } from "../const";
import crypto from "crypto-js";
const aesKey = crypto.enc.Utf8.parse("aeskeyaeskeyaeskeyaeskeyaeskey32");
const aesIv = crypto.enc.Utf8.parse("0123456789abcdef");
const aesOptions = {
    iv: aesIv,
    mode: crypto.mode.CBC,
    padding: crypto.pad.Pkcs7,
};
export function encodeTGID(tgid: string) {
    return crypto.AES.encrypt(tgid, aesKey, aesOptions).ciphertext.toString();
    //AES.encrypt(tgid, SECRET_FOR_ENCODE_TGID).toString();
}
export function decodeTGID(tgid: string) {
    const encoded = { ciphertext: crypto.enc.Hex.parse(tgid) };
    return crypto.enc.Utf8.stringify(crypto.AES.decrypt(encoded as any, aesKey, aesOptions));
}
