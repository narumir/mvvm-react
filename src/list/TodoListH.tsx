import { Item, TodoList } from "./TodoList";
import React from "react";
import { TodoListV } from "./TodoListV";

export class TodoListH {
  cat = "";
  vm = new TodoList();
  keydown = ({ target, keyCode }: KeyboardEvent) => {
    const input = target as HTMLInputElement;
    if (!input.value || keyCode !== 13) return;
    this.vm.add(input.value);
    input.value = "";
  };
  remove = (item: Item) => this.vm.remove(item);
  toggle = (item: Item) => this.vm.toggle(item);
  constructor(cat: string) {
    this.cat = cat;
  }
  get view() {
    return (<TodoListV holder={this} />);
  }
}