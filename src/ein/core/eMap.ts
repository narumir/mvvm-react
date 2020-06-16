export class eMap {
  static stringify<T, R>(map: Map<T, R>) {
    // @ts-ignore
    return JSON.stringify([...map.entries()].reduce((p, [k, v]) => (p[k] = v, p), {}));
  }
}