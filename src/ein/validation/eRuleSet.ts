import { regParam } from "../core/regParam";

type F = (v: any) => any;
type ruleF = (arg: string[]) => F;
const ip = /^(?:(?:[0-9]|(?:1\d{1,2})|(?:2[0-4]\d)|(?:25[0-5]))[.]){3}(?:[0-9]|[1-9][0-9]{1,2}|2[0-4]\d|25[0-5])$/;
const korean = /^[ㄱ-힣]+$/;
const japanese = /^[ぁ-んァ-ヶー一-龠！-ﾟ・～「」“”‘’｛｝〜−]+$/;
const lower = /^[a-z]+$/;
const upper = /^[A-Z]+$/;
const num = /^(?:-?(?:0|[1-9]\d*)(?:\.\d+)(?:[eE][-+]?\d+)?)|(?:-?(?:0|[1-9]\d*))$/;
const intnum = /^(?:-?(?:0|[1-9]\d*))$/;
const doublenum = /^(?:-?(?:0|[1-9]\d*)(?:\.\d+)(?:[eE][-+]?\d+)?)$/;
const lowernum = /^[a-z0-9]+$/;
const uppernum = /^[A-Z0-9]+$/;
const alphanum = /^[a-zA-Z0-9]+$/;
const firstlower = /^[a-z]/;
const firstUpper = /^[A-Z]/;
const noblank = /\s/;
const email = /^[0-9a-zA-Z-_.]+@[0-9a-zA-Z-]+(?:[.]+[A-Za-z]{2,4})+$/;
const url = /^https?:\/\/[a-zA-Z0-9.-]+(?:[.]+[A-Za-z]{2,4})+(?:[:]\d{2,4})?/;
const FALSE = {};
/*
{
    "ruleset":{
        "https":"trim|startwith[https]|url",
        "title":"trim|range[4,255]"
    }
}
 */
export class eRuleSet {
  static load(res: any) {
    if ("ruleset" in res) Object.entries(res["ruleset"] as Record<string, any>).forEach(([k, v]) => this.setRuleSet(k, v));
  }
  static readonly EMPTY = new eRuleSet("");
  private static readonly rules = new Map<string, ruleF>([
    ["number", (_) => v => typeof v === "number" ? v : FALSE],
    ["string", (_) => v => typeof v === "string" ? v : FALSE],
    ["boolean", (_) => v => typeof v === "boolean" ? v : FALSE],
    ["ip", (_) => v => ip.test(v) ? v : FALSE],
    ["url", (_) => v => url.test(v) ? v : FALSE],
    ["email", (_) => v => email.test(v) ? v : FALSE],
    ["korean", (_) => v => korean.test(v) ? v : FALSE],
    ["japanese", (_) => v => japanese.test(v) ? v : FALSE],
    ["lower", (_) => v => lower.test(v) ? v : FALSE],
    ["upper", (_) => v => upper.test(v) ? v : FALSE],
    ["num", (_) => v => num.test(v) ? v : FALSE],
    ["intnum", (_) => v => intnum.test(v) ? v : FALSE],
    ["doublenum", (_) => v => doublenum.test(v) ? v : FALSE],
    ["lowernum", (_) => v => lowernum.test(v) ? v : FALSE],
    ["uppernum", (_) => v => uppernum.test(v) ? v : FALSE],
    ["alphanum", (_) => v => alphanum.test(v) ? v : FALSE],
    ["firstlower", (_) => v => firstlower.test(v) ? v : FALSE],
    ["firstUpper", (_) => v => firstUpper.test(v) ? v : FALSE],
    ["noblank", (_) => v => noblank.test(v) ? v : FALSE],
    ["startwith", (arg) => v => v.startsWith(arg[0]) ? v : FALSE],
    ["endwith", (arg) => v => v.endsWith(arg[0]) ? v : FALSE],
    ["empty", (_) => v => !v.trim() ? v : FALSE],
    ["length", (arg) => v => v.length === +arg[0] ? v : FALSE],
    ["minlength", (arg) => v => v.length >= +arg[0] ? v : FALSE],
    ["maxlength", (arg) => v => v.length <= +arg[0] ? v : FALSE],
    ["lessthan", (arg) => v => v < +arg[0] ? v : FALSE],
    ["greaterthan", (arg) => v => v > +arg[0] ? v : FALSE],
    ["norule", (_) => v => v],
    ["range", (arg) => v => {
      switch (typeof v) {
        case "number": return +arg[0] <= v && v <= +arg[1] ? v : FALSE;
        case "string": return +arg[0] <= v.length && v.length <= +arg[1] ? v : FALSE;
        default: return FALSE;
      }
    }],
    ["equal", (arg) => v => {
      switch (typeof v) {
        case "number": return +arg[0] === v ? v : FALSE;
        case "string": return arg[0] === v ? v : FALSE;
        case "boolean": return (arg[0] === "true") === v ? v : FALSE;
        default: return FALSE;
      }
    }],
    ["in", (arg) => v => {
      switch (typeof v) {
        case "number": return arg.some(it => +it === v) ? v : FALSE;
        case "string": return arg.some(it => it === v) ? v : FALSE;
        default: return FALSE;
      }
    }],
    ["notblank", (_) => v => v.trim() ? v : FALSE],
    ["trim", (_) => v => v.trim()],
    ["oneline", (arg) => v => v.includes("\n") ? FALSE : v]
  ]);
  private static readonly rulesets = new Map<string, eRuleSet>();
  static get string() { return this.rulesets.get("string")!!; }
  static getRule(k: string) {
    if (!this.rules.has(k)) throw `invalid rule:${k}`;
    return this.rules.get(k)!!;
  }
  static setRule(k: string, rule: ruleF) { this.rules.set(k, rule); }
  static removeRule(k: string) { this.rules.delete(k); }
  static getRuleset(k: string) { return this.rulesets.get(k) ?? this.setRuleSet(k, k); }
  static setRuleSet(k: string, rule: string) {
    const ruleset = new eRuleSet(rule);
    this.rulesets.set(k, ruleset);
    return ruleset;
  }
  static removeRuleSet(k: string) { this.rulesets.delete(k); }

  readonly msgKey = new WeakMap<F, string>();
  private readonly rule: F[][];
  constructor(rule: string) {
    this.rule = rule.split("-or-").map(it =>
      it.split("|").filter(it => it).map(v => {
        const parsed = regParam.exec(v)!!;
        const k = parsed[1], arg = parsed[2].split(",");
        if (k.includes('@')) {
          const ks = k.split('@');
          const r = eRuleSet.getRule(ks[1])(arg);
          this.msgKey.set(r, ks[0]);
          return r;
        } else return eRuleSet.getRule(k)(arg)
      })
    );
  }
  check(v: any): [boolean, any] {
    let r = v, key = "@default";
    return this.rule.some(it => {
      r = v;
      it.every(f => {
        if (this.msgKey.has(f)) key = this.msgKey.get(f)!!;
        r = f(r);
        return r !== FALSE;
      });
    }) ? [true, r] : [false, key];
  }
}