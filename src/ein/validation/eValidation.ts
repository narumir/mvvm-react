

/*
{
    "validation":{
        "@default":"@{cdata.error}", //optinal, default error msg for all validations
        "rating":{ //key
            "type":"base", //optional, default "base"
            "ruleset":"trim|string|a@range[1,5]-or-b@first[a]|c@range[1,4]", //mandatory
            "msg":{ //optional
                "@default":"@{cdata.error/rating}", //optional
                "a":"범위가 다름",
                "b":"첫글자가 a가 아님",
                "c":"범위가 다름"
            },
            "arg":{ //optional
                "relatedField":"confirmPw"
            }
        },
        "passConfirm":{
            type:"pw",
            ruleset:"",
            msg:{
             "@default":"같지 않다"
            },
            arg:{
               key:"pass"
            }
        }
    }
}
 */
import { eRuleSet } from "./eRuleSet";

type eValiF = (rs: eRuleSet, m: any, a: any) => eValidation;
export class eValidation {
  static load(res: any) {
    const it: any = res["validation"];
    if (!it) return;
    Object.entries(it as Record<string, any>).forEach(([k, v]) => {
      if (k === "@default") this.defaultMsg = v;
      else this.set(k, v);
    });
  }
  static defaultMsg = "invalid";
  private static map = new Map<string, eValidation>();
  private static types = new Map<string, eValiF>([
    ["base", (r, m, a) => {
      const vali = new eValidation();
      vali.ruleset = r
      vali.msg = m
      vali.arg = a
      return vali;
    }],
    ["same", (_, m, a) => {
      const vali = new eSameVali();
      vali.msg = m
      if (a && a["key"]) vali.keys = a["key"].split(",");
      return vali;
    }]
  ]);
  static set(k: string, v: any) {
    const type = this.types.get(v["type"] ?? "base")!!;
    if (!type) throw `invalid type:${v["type"]}`;
    this.map.set(k, type(
      v["ruleset"] ? new eRuleSet(v["ruleset"]) : eRuleSet.EMPTY,
      v["msg"],
      v["arg"]
    ));
  }
  static setType(k: string, f: eValiF) { this.types.set(k, f); }
  static get(k: string) { return this.map.get(k); }
  static validate(v: Map<string, any>): [boolean, string] {
    let result = true, msg = "";
    [...v.entries()].some(([k, v]) => {
      const it = this.map.get(k)
      if (it) {
        const checked = it.check(v);
        if (!checked[0]) {
          result = false;
          msg = `${checked[1]}`;
          return false;
        } else return true;
      } else {
        result = false;
        msg = `invalid key0:${k}`;
        return false;
      }
    });
    return [result, msg];
  }
  private ruleset?: eRuleSet;
  msg: any;
  arg: any;
  protected get defaultM() { return this.msg?.get("@default") ?? eValidation.defaultMsg; }
  check(v: any): [boolean, any] {
    const it = this.ruleset?.check(v);
    if (it) return it[0] ? it : [false, this.msg ? this.msg[it[1]] : this.defaultM];
    else return [false, "No ruleset"];
  }
  check2(d: any, v: any) { }
}
export class eSameVali extends eValidation {
  private static readonly EMPTY: string[] = [];

  keys = eSameVali.EMPTY;
  check2(d: any, v: any) {
    if (this.keys.every(k => d === v[k])) return [true, ""];
    else return [false, this.defaultM];
  }
}
