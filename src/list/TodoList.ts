import {
  TodoListRouter,
} from "./TodoListRouter";

export type Item = { title: string, isComplete: boolean };
export class TodoList {
  items = new Set<Item>();
  add = (title: string) => {
    this.items.add({ title, isComplete: false });
    TodoListRouter.flush();
  };
  remove = (todo: Item) => {
    this.items.delete(todo);
    TodoListRouter.flush();
  };
  toggle = (todo: Item) => {
    todo.isComplete = !todo.isComplete;
    TodoListRouter.flush();
  };
}
