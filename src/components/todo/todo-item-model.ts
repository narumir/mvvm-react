import {
  TodoRouter,
} from "./todo-router";

export class TodoItemModel {
  items = new Map<string, Todo>();

  add = (title: string) => {
    this.items.set(title, { title, isComplete: false });
    TodoRouter.flush();
  }

  remove = (title: string) => {
    this.items.delete(title);
    TodoRouter.flush();
  }

  toggle = (todo: string) => {
    const item = this.items.get(todo);
    if (item != null) {
      item.isComplete = !item.isComplete;
    }
    TodoRouter.flush();
  }
}

export interface Todo {
  title: string;
  isComplete: boolean;
}
