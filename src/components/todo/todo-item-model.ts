import {
  TodoRouter,
} from "./todo-router";

export class TodoItemModel {
  items = new Map<string, Todo>();

  add = (title: string) => {
    if (this.items.has(title)) {
      return this.items.get(title)!!;
    } else {
      this.items.set(title, { title, isComplete: false });
    }
    TodoRouter.flush();
  }
  delete = (title: string) => {
    this.items.delete(title);
    TodoRouter.flush();
  }
  toggle = (todo: Todo) => {
    todo.isComplete = !todo.isComplete;
    TodoRouter.flush();
  }
}

export interface Todo {
  title: string;
  isComplete: boolean;
}
