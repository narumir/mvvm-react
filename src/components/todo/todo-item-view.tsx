import React, {
  FC,
  useCallback,
} from "react";
import {
  TodoItemHolder,
} from "./todo-item-holder";

export const TodoItemView: FC<TodoItemViewProps> = ({
  holder: {
    category,
    items,
    add
  },
}) => {
  const addTodo = useCallback(add, []);
  return (
    <div>
      <p>{category}</p>
      <input onKeyDown={addTodo} />
      {items.map(([key, item]) => (
        <li key={key}>
          {item.title}
        </li>
      ))}
    </div>
  );
};

interface TodoItemViewProps {
  holder: TodoItemHolder;
}