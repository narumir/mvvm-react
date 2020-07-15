import React, {
  FC,
  Fragment,
} from "react";
import {
  CategoryView,
  TodoView,
  CategoryModel,
} from "src/components";

export const App: FC = () => {
  CategoryModel.use();
  return (
    <Fragment>
      <h1>Todos</h1>
      <CategoryView />
      <TodoView />
    </Fragment>
  );
};
