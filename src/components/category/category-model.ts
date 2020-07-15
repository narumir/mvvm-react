import {
  SimpleUpdater,
} from "src/modules";

export class CategoryModel {
  private static readonly _updater = new SimpleUpdater();
  static readonly category = new Set<string>();

  static use() {
    CategoryModel._updater.use();
  }

  static flush() {
    CategoryModel._updater.flush();
  }

  static add(category: string) {
    CategoryModel.category.add(category);
    CategoryModel.flush();
  }

  static remove(category: string) {
    CategoryModel.category.delete(category);
    CategoryModel.flush();
  }
}
