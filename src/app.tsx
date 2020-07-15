import React, {
  FC,
  Fragment,
} from "react";
import {
  CategoryView,
  TodoView,
} from "src/components";

export const App: FC = () => {
  return (
    <Fragment>
      <h1>Todos</h1>
      <CategoryView />
      <TodoView />
    </Fragment>
  );
};
