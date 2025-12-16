import CryptoJS from "crypto-es";
import { WordArray } from "crypto-es/lib/core";
import { CONFIG } from "@/config/global";

export const strDecryptMethod = (cryptData: string) => {
  try {
    let key: string | WordArray = CONFIG.auth.cryptoKey;
    key = CryptoJS.enc.Utf8.parse(key);
    const out = CryptoJS.AES.decrypt(cryptData, key, {
      mode: CryptoJS.mode.ECB,
    });
    return out.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return null;
  }
};

export const jsonDecryptMethod = (cryptData: string) => {
  try {
    const data = strDecryptMethod(cryptData);
    return data && JSON.parse(data);
  } catch (e) {
    return null;
  }
};

export const strEncryptMethod = (data: string) => {
  try {
    let key: string | WordArray = CONFIG.auth.cryptoKey;
    key = CryptoJS.enc.Utf8.parse(key);
    const encryptData = CryptoJS.AES.encrypt(data, key, {
      mode: CryptoJS.mode.ECB,
    });
    return encryptData.toString();
  } catch (e) {
    return null;
  }
};

export const jsonEncryptMethod = (data: object) => {
  try {
    return strEncryptMethod(JSON.stringify(data));
  } catch (e) {
    return null;
  }
};
