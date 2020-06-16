import {
  KeyboardEvent,
} from "react";
import {
  Category,
} from "./Category";

export class CategoryHolder {
  private static readonly selects = new Map<string, () => void>();
  private static readonly removes = new Map<string, () => void>();

  static add(event: KeyboardEvent<HTMLInputElement>) {
    const input = event.target as HTMLInputElement;
    if (!input.value.trim() || event.keyCode !== 13) {
      return;
    }
    Category.add(input.value.trim());
    input.value = "";
  }

  static select(key: string) {
    const {
      selects,
    } = CategoryHolder;
    if (!selects.has(key)) {
      selects.set(key, () => Category.current = key);
    }
    return selects.get(key)!!;
  }

  static remove(key: string) {
    const {
      removes,
    } = CategoryHolder;
    if (!removes.has(key)) {
      removes.set(key, () => Category.remove(key));
    }
    console.log(removes)
    return removes.get(key)!!;
  }
}
