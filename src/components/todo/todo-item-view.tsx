import React, {
  FC,
} from "react";
import {
  TodoItemHolder,
} from "./todo-item-holder";

export const TodoItemView: FC<TodoItemViewProps> = ({
  holder: {
    category,
    items,
    onKeyDown,
  },
}) => {
  return (
    <div>
      <p>{category}</p>
      <input onKeyDown={onKeyDown} />
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