import React, { useContext } from "react";

const ctx = new Map<string, React.Context<any>>();

export function getContext<T>(k: string, def: T) {
  let v: any;
  return (ctx.get(k) ?? (ctx.set(k, v = React.createContext<T>(def)), v)) as React.Context<T>;
}
export function useCtx<T>(k: string) {
  if (!ctx.has(k)) throw new Error("invalid key" + k);
  return useContext(ctx.get(k)!!) as T;
}
