import {
  SimpleUpdater,
} from "../ein/react/SimpleUpdater";

export class Category {
  private static _updater = new SimpleUpdater();
  private static _current = "";
  static readonly list = new Set<string>();

  static use() {
    Category._updater.use();
  }

  static flush() {
    Category._updater.flush();
  }

  static add(v: string) {
    Category.list.add(v);
    Category.flush();
  }

  static remove(v: string) {
    Category.list.delete(v);
    Category.flush();
  }

  static get current() {
    return Category._current;
  }

  static set current(v) {
    Category._current = v;
    Category.flush();
  }
}
