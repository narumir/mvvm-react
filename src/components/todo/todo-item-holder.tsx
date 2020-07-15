import React, {
  KeyboardEvent,
  MouseEvent,
} from "react";
import {
  TodoItemModel,
} from "./todo-item-model";
import {
  TodoItemView,
} from "./todo-item-view";

export class TodoItemHolder {
  category = "";
  vm = new TodoItemModel();

  constructor(category: string) {
    this.category = category;
  }

  add = (event: KeyboardEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const value = target.value.trim();
    if (event.keyCode !== 13) {
      return;
    }
    this.vm.add(value);
    target.value = "";
  }

  remove = (e: MouseEvent<HTMLButtonElement>) => {
    const key = e.currentTarget.dataset["key"] as string;
    if (key != null && typeof key === "string") {
      this.vm.remove(key);
    }
  }

  toggle = (e: MouseEvent<HTMLSpanElement>) => {
    const key = e.currentTarget.dataset["key"] as string;
    if (key != null && typeof key === "string") {
      this.vm.toggle(key);
    }
  }

  get items() {
    return [...this.vm.items.values()];
  }

  get view() {
    return (<TodoItemView holder={this} />)
  }
}
