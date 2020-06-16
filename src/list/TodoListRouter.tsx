import React from "react";
import { Category } from "../nav/Category";
import { TodoListH } from "./TodoListH";
import { SimpleUpdater } from "../ein/react/SimpleUpdater";

export class TodoListRouter {
  private static readonly map = new Map<string, TodoListH>();
  private static _ = new SimpleUpdater();
  static flush() { TodoListRouter._.flush(); }
  static use() {
    TodoListRouter._.use();
    const curr = Category.current;
    if (!curr) return (<></>);
    const { map } = TodoListRouter;
    if (!map.has(curr)) map.set(curr, new TodoListH(curr));
    return map.get(curr)!!.view;
  }
}
