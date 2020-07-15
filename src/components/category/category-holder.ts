import {
  KeyboardEvent,
} from "react";
import {
  CategoryModel,
} from "./category-model";
import { TodoRouter } from "../todo";

export class CategoryHolder {
  private static readonly selects = new Map<string, () => void>();
  private static readonly removes = new Map<string, () => void>();

  static onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const target = event.currentTarget;
    const value = target.value.trim();
    if (event.keyCode !== 13) {
      return;
    }
    CategoryModel.add(value);
    target.value = "";
  }

  static select(key: string) {
    const {
      selects,
    } = CategoryHolder;
    if (!selects.has(key)) {
      selects.set(key, () => TodoRouter.current = key);
    }
    return selects.get(key)!!;
  }

  static remove(key: string) {
    const {
      removes,
    } = CategoryHolder;
    if (!removes.has(key)) {
      removes.set(key, () => CategoryModel.remove(key));
    }
    return removes.get(key)!!;
  }

  static get category() {
    return [...CategoryModel.category];
  }
}
