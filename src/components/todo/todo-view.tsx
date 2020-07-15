import React, {
  FC,
} from "react";
import {
  TodoRouter,
} from "./todo-router";

export const TodoView: FC = () => {
  TodoRouter.use();
  return (
    <div>
      {TodoRouter.render()}
    </div>
  );
};
