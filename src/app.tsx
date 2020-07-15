import React from "react";
import {
  CategoryView,
  TodoView,
} from "src/components";

export const App = () => {
  return (<>
    <h1>Todos</h1>
    <CategoryView />
    <TodoView />
  </>);
};
