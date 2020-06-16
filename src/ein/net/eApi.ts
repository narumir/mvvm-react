import { eRequest } from "./eRequest";
import { eResponse } from "./eResponse";
import { eMap } from "../core/eMap";
import { regParam } from "../core/regParam";

type requestTaskF = (request: eRequest, item: Map<string, any>, arg: string[]) => Promise<boolean>;
type responseTaskF = (request: eResponse, arg: string[]) => Promise<boolean>;
type api = {
  url: string;
  method: string;
  requestTask?: string[];
  responseTask?: string[];
  requestItem?: Map<string, boolean>;
};
export class eApi {
  private static apiData(map: Map<string, api>, rqT: Map<string, string>, rpT: Map<string, string>, k: string, v: any) {
    const reqT = v["requestTask"], resT = v["responseTask"], req = v["request"];
    map.set(k, {
      url: `${v["url"]}`,
      method: v["method"]?.toUpperCase() ?? "POST",
      requestTask: typeof reqT === 'string' ? reqT.split("|").map(it => rqT.get(it.trim()) ?? it.trim())?.join("|")?.split("|") : undefined,
      responseTask: typeof resT === 'string' ? resT.split("|").map(it => rpT.get(it.trim()) ?? it.trim())?.join("|")?.split("|") : undefined,
      requestItem: typeof req === 'string' ? new Map(req.split(",").map(it => [it.trim(), true])) : undefined
    });
  }
  static load(res: any) {
    const it: any = res["api"];
    if (!it) return;
    const prefix = it["@prefix"] ?? "";
    if (typeof prefix === "string") this.prefix.set("@default", prefix);
    else Object.entries(prefix as Record<string, string>).forEach(([k, v]) => this.prefix.set(k, v));
    const suffix = it["@suffix"] ?? "";
    if (typeof suffix === "string") this.suffix.set("@default", suffix);
    else Object.entries(suffix as Record<string, string>).forEach(([k, v]) => this.suffix.set(k, v));

    const rqT = new Map<string, string>();
    const rpT = new Map<string, string>();
    const requestTask = it["@requestTask"], responseTask = it["@responseTask"];
    if (requestTask) Object.entries(requestTask).forEach(([k, v]) => rqT.set(k, requestTask[k]));
    if (responseTask) Object.entries(responseTask).forEach(([k, v]) => rpT.set(k, requestTask[k]));
    Object.entries(it as Record<string, any>).forEach(([k, v]) => {
      if (k[0] === "@") return;
      const def = new Map<string, api>();
      if ("url" in v) this.apiData(def, rqT, rpT, "@default", v);
      else Object.entries(v as Record<string, any>).forEach(([k, v]) => this.apiData(def, rqT, rpT, k, v));
      this.set(k, new eApi(k, def));
    });
  }
  static readonly EXTRA_JSON = "EXTRA_JSON";
  static readonly EXTRA_BODY = "EXTRA_BODY";
  static readonly EXTRA_REQUEST_BODY = "EXTRA_REQUEST_BODY";
  static mode = "@default";
  private static readonly prefix = new Map<string, string>();
  private static readonly suffix = new Map<string, string>();
  private static readonly apis = new Map<string, eApi>();
  private static readonly requestTasks = new Map<string, requestTaskF>([
    ["header", async (request, item, arg) => {
      let cnt = 0
      arg.forEach(k => {
        if (item.has(k)) {
          request.header(k, item.get(k));
          cnt++;
        }
      });
      return cnt === arg.length;
    }],
    ["formdata", async (request, item, arg) =>
      arg.every(k => {
        if (item.has(k)) {
          request.form(k, item.get(k));
          return true;
        } else return false;
      })
    ],
    ["urlpath", async (request, item, arg) =>
      arg.every(k => {
        if (item.has(k)) {
          request.url += "/" + item.get(k);
          return true;
        } else return false;
      })
    ],
    ["json", async (request, item, _) => {
      request.extra.set(eApi.EXTRA_JSON, eMap.stringify(item));
      return true;
    }],
    ["jsonbody", async (request, item, arg) => {
      if (request.extra.has(eApi.EXTRA_REQUEST_BODY)) return false;
      else {
        request.extra.set(eApi.EXTRA_REQUEST_BODY, "json");
        if (arg.length === 1) {
          request.json(item.get(arg[0]));
          return true;
        } else {
          const it = request.extra.get(eApi.EXTRA_JSON);
          if (it) {
            request.json(it);
            return true;
          } else return false;
        }
      }
    }],
    ["body", async (request, item, arg) => {
      if (request.extra.has(eApi.EXTRA_REQUEST_BODY)) return false;
      else {
        request.extra.set(eApi.EXTRA_REQUEST_BODY, "body");
        if (arg.length === 1) {
          request.body(item.get(arg[0]));
          return true;
        } else if (request.extra.has(eApi.EXTRA_BODY)) {
          request.body(request.extra.get(eApi.EXTRA_BODY));
          return true;
        } else return false;
      }
    }]
  ]);
  private static readonly responseTasks = new Map<string, responseTaskF>([
    ["json", async (res, _) => {
      const json = await res.json();
      res.extra.set(eApi.EXTRA_JSON, json);
      res.result = json;
      return true;
    }],
    ["body", async (res, _) => {
      const text = await res.text();
      res.extra.set(eApi.EXTRA_BODY, text);
      res.result = text;
      return true;
    }]
  ]);
  static setRequestTask(k: string, block: requestTaskF) { this.requestTasks.set(k, block); }
  static setResponseTask(k: string, block: responseTaskF) { this.responseTasks.set(k, block); }
  static get(k: string) { return this.apis.get(k); }
  static set(k: string, api: eApi) { this.apis.set(k, api); }
  static remove(k: string) { this.apis.delete(k); }

  readonly key: string;
  readonly def: Map<string, api>;
  constructor(key: string, def: Map<string, api>) {
    this.key = key;
    this.def = def;
  }
  async invoke(...arg: [string, any][]) {
    if (!this.def.has(eApi.mode)) throw `no mode data: ${eApi.mode} in ${this.key}`;
    const { url, method, requestTask, responseTask, requestItem } = this.def.get(eApi.mode)!!;
    const reqItem = new Map<string, any>();
    {
      const it = requestItem;
      if (arg.length === 0) {
        if (it) return new eResponse(undefined, `1invalid arg count:arg ${arg.length}, api 0`);
      } else {
        if (arg.length !== it?.size) return new eResponse(undefined, `invalid arg count:arg ${arg.length}, api ${it?.size}`);
        arg.forEach(([k, v]) => {
          if (!it.has(k)) return new eResponse(undefined, `invalid request param:${k}`);
          reqItem.set(k, v);
        });
      }
    }
    const request = new eRequest(`${eApi.prefix.get(eApi.mode)}${url}${eApi.suffix.get(eApi.mode)}`, method);
    {
      const tasks = requestTask;
      if (tasks && tasks.length) for (const it of tasks) {
        const parsed = regParam.exec(it)!!;
        const k = parsed[1], a = parsed[2];
        const task = eApi.requestTasks.get(k.trim());
        if (task) {
          if (!(await task(request, reqItem, a.split(",").map(it => it.trim())))) {
            return new eResponse(undefined, "request task stop:$k for $key");
          }
        } else {
          return new eResponse(undefined, "invalid request task:$k for $key");
        }
      }
    }
    const res = await request.send();
    if (res.error != null) return res;
    else {
      const tasks = responseTask;
      if (tasks && tasks.length) for (const it of tasks) {
        const [, k, a] = it.match(regParam) ?? [];
        const task = eApi.responseTasks.get(k.trim());
        if (task) {
          if (!await task(res, a.split(",").map(it => it.trim()))) {
            res.error = `error response task:${k}, ${a} for ${this.key}`;
            return res;
          }
        } else {
          res.error = `invalid response task:${k}, ${a} for ${this.key}`;
          return res;
        }
      }
      return res;
    }
  }
}
