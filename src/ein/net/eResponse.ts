export class eResponse {
  error = ""
  extra = new Map<string, any>();
  result: any = "";
  state: number;
  res?: Response;
  isOpened = false
  get isOk() { return !!this.error; }
  constructor(res?: Response, error = "") {
    this.res = res;
    this.error = error;
    this.state = res?.status ?? 0;
  }
  header(k: string) { return this.res?.headers?.get(k) ?? ""; }
  async text() {
    if (this.isOpened) throw "is opened";
    this.isOpened = true
    return await this.res?.text() ?? "";
  }
  async json() {
    if (this.isOpened) throw "is opened"
    this.isOpened = true
    return await this.res?.json() ?? {};
  }
  /*bytes(block:(ByteArray?)->Unit) {
      if(isOpened) throw  Throwable("is opened")
      isOpened = true
      res?.blob()?.then{
          val fileReader = FileReader()
          fileReader.onload = {
              val r = Int8Array((fileReader.result as ArrayBuffer))
              var i = 0
              val j = r.byteLength
              val bytes = ByteArray(j)
              while(i < j){
              bytes.set(i, r.get(i))
              i++
          }
          block(bytes)
          1
      };
          fileReader.readAsArrayBuffer(it)
      } ?: block(null)
  }*/
}