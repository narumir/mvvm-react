export const ip = /^(?:(?:[0-9]|(?:1\d{1,2})|(?:2[0-4]\d)|(?:25[0-5]))[.]){3}(?:[0-9]|[1-9][0-9]{1,2}|2[0-4]\d|25[0-5])$/;
export const korean = /^[ㄱ-힣]+$/;
export const japanese = /^[ぁ-んァ-ヶー一-龠！-ﾟ・～「」“”‘’｛｝〜−]+$/;
export const lower = /^[a-z]+$/;
export const upper = /^[A-Z]+$/;
export const num = /^(?:-?(?:0|[1-9]\d*)(?:\.\d+)(?:[eE][-+]?\d+)?)|(?:-?(?:0|[1-9]\d*))$/;
export const intnum = /^(?:-?(?:0|[1-9]\d*))$/;
export const doublenum = /^(?:-?(?:0|[1-9]\d*)(?:\.\d+)(?:[eE][-+]?\d+)?)$/;
export const lowernum = /^[a-z0-9]+$/;
export const uppernum = /^[A-Z0-9]+$/;
export const alphanum = /^[a-zA-Z0-9]+$/;
export const firstlower = /^[a-z]/;
export const firstUpper = /^[A-Z]/;
export const noblank = /\s/;
export const email = /^[0-9a-zA-Z-_.]+@[0-9a-zA-Z-]+(?:[.]+[A-Za-z]{2,4})+$/;
export const url = /^https?:\/\/[a-zA-Z0-9.-]+(?:[.]+[A-Za-z]{2,4})+(?:[:]\d{2,4})?/;
export const regParam = /([^\[]+)\[([^\]]+)\]/g;
export const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);