import { eResponse } from "./eResponse";

export class eRequest {
  readonly method: string;
  readonly extra = new Map<string, any>();
  url: string;
  _header?: Map<string, string>;
  _form?: [string, string][];
  _json?: string;
  _text?: string;
  //blob:ByteArray? = null
  //files:MutableMap<string, File>? = null
  private _retry = 1;
  readTimeout = 5000;
  connectTimeout = 3000;
  private isUsed = false;

  constructor(url: string, method = "GET") {
    this.url = url;
    this.method = method.toUpperCase();
  }
  header(k: string, v: string) {
    if (!this._header) this._header = new Map();
    this._header?.set(k, v);
  }
  form(k: string, v: string) {
    if (!this._form) this._form = [];
    this._form?.push([k, v]);
  }
  json(v: any) { this._json = typeof v == "string" ? v : JSON.stringify(v); }
  body(v: any) { this._text = typeof v == "string" ? v : JSON.stringify(v); }
  retry(v: number) { this._retry = v; }
  timeout(read: number, connect = 3000) {
    this.readTimeout = read;
    this.connectTimeout = connect;
  }
  //bytes(v:ByteArray){blob = v}
  /*
  file(key:string, filename:string, mine:string, file:ByteArray){
      if(files == null) files = mutableMapOf()
      files?.put(key, File(filename, mine, file))
  }
   */
  async send() {
    // eslint-disable-next-line no-throw-literal
    if (this.isUsed) throw "used request";
    this.isUsed = true
    const i = this.url.lastIndexOf('#');
    if (i !== -1) this.url = this.url.substring(0, i)
    console.log("methgod", this.method)
    if (this.method === "GET") {
      console.log("get", this._form)
      if (this._form) this.url += (this.url.lastIndexOf('?') === -1 ? "?" : "&") +
        this._form.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
    }
    const req = {
      method: this.method,
      headers: { "Cache-Control": "no-cache" },
      body: null
    };
    this._header?.forEach((v, k) => {
      // @ts-ignore
      req.headers[k] = v;
    });
    if (this.method === "GET") {
      // @ts-ignore
      req.headers["Content-Type"] = "text/plain; charset=utf-8"
    } else {
      /*request.files?.let {
          req.body = FormData().apply {
              it.forEach{(k, v)->
                  append(k, Blob(arrayOf(Int8Array(v.file.toTypedArray())), BlobPropertyBag(v.mine)))
              }
              request.json?.let {
                  append("json", it)
              } ?: request.text?.let {
                  append("text", it)
              } ?: request.form?.let {
                  it.forEach{(k, v)->append(k, v)}
              }
          }
      } ?: request.blob?.let {
          req.headers["Content-Type"] = "application/octet-stream; charset=utf-8"
          req.body = Blob(arrayOf(Int8Array(it.toTypedArray())), BlobPropertyBag("application/octet-stream"))
      }*/
      if (this._json) {
        // @ts-ignore
        req.headers["Content-Type"] = "application/json; charset=utf-8"
        // @ts-ignore
        req.body = this._json;
      } else if (this._text) {
        // @ts-ignore
        req.headers["Content-Type"] = "application/text; charset=utf-8"
        // @ts-ignore
        req.body = this._text
      } else if (this._form) {
        // @ts-ignore
        req.body = this._form.reduce((p, [k, v]) => (p.append(k, v), p), new FormData());
      }
    }
    let isTimeout = false
    let id = -1;
    try {
      const a: any = await Promise.race([
        new Promise(res => {
          id = window.setTimeout(() => {
            if (!isTimeout) {
              isTimeout = true;
              res(new eResponse(undefined, "timeout"));
            }
          }, this.readTimeout);
        }),
        fetch(new Request(this.url, req))
      ]);
      if (a instanceof Response) {
        clearTimeout(id);
        isTimeout = true;
        return new eResponse(a);
      } else {
        if (!isTimeout) {
          clearTimeout(id);
          isTimeout = true;
          if (a.status === 404) throw "not ok";
          return new eResponse(a);
        }
      }
    } catch (e) {
      if (!isTimeout) {
        clearTimeout(id)
        return new eResponse(undefined, e.toString());
      }
    }
    return new eResponse(undefined, "error");
  }
}
//class File(val filename:string, val mine:string, val file:ByteArray)
