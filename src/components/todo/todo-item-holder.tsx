import React, {
  KeyboardEvent,
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

  get items() {
    return [...this.vm.items];
  }

  get view() {
    return (<TodoItemView holder={this} />)
  }
}
