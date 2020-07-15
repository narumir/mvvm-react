import {
  SimpleUpdater,
} from "src/modules";
import {
  TodoItemHolder,
} from "./todo-item-holder"; 

export class TodoRouter {
  private static readonly _updater = new SimpleUpdater();
  private static readonly map = new Map<string, TodoItemHolder>();
  private static _current: string;

  static use() {
    TodoRouter._updater.use();
  }
  static flush() {
    TodoRouter._updater.flush();
  }
  static render() {
    const {
      current,
      map,
    } = TodoRouter;
    if (!current) {
      return null;
    }
    if (!map.has(current)) {
      map.set(current, new TodoItemHolder(current));
    }
    return map.get(current)!!.view;
  }

  static get current() {
    return TodoRouter._current;
  }

  static set current(category: string) {
    TodoRouter._current = category;
    TodoRouter.flush();
  }
}
