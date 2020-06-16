import { useState } from "react";

export interface StateSetter { stateSetter: any; }
export const setState = (origin: StateSetter, newone: StateSetter) => origin.stateSetter && (newone.stateSetter = origin.stateSetter)(newone);
export function useStateSetter<T extends StateSetter>(factory: (() => T) | T): T {
  const [g, s] = useState<T>(factory);
  g.stateSetter = s;
  return g;
}
