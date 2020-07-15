import {
  KeyboardEvent,
  MouseEvent,
} from "react";
import {
  TodoRouter,
} from "src/components";
import {
  CategoryModel,
} from "./category-model";

export class CategoryHolder {
  private static readonly selects = new Map<string, () => void>();
  private static readonly removes = new Map<string, () => void>();

  static add(event: KeyboardEvent<HTMLInputElement>) {
    const target = event.currentTarget;
    const value = target.value.trim();
    if (event.keyCode !== 13) {
      return;
    }
    CategoryModel.add(value);
    target.value = "";
  }

  static select(e: MouseEvent<HTMLSpanElement>) {
    const key = e.currentTarget.dataset["key"] as string;
    if (key != null && typeof key === "string") {
      TodoRouter.current = key;
    }
  }

  static remove(e: MouseEvent<HTMLButtonElement>) {
    const key = e.currentTarget.dataset["key"] as string;
    if (key != null && typeof key === "string") {
      CategoryModel.remove(key);
    }
  }

  static get category() {
    return [...CategoryModel.category];
  }
}
