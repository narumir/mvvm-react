import { useState } from "react";

export const useLiteState = (factory: any, ...arg: any) => {
  let [g, s] = useState(undefined);
  if (g === undefined) s(g = factory(...arg));
  return g;
};
