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
    add,
    remove,
    toggle,
  },
}) => {
  return (
    <div>
      <p>{category}</p>
      <input onKeyDown={add} />
      {items.map((item) => (
        <li key={item.title}>
          <span data-key={item.title} onClick={toggle} style={{ textDecoration: item.isComplete ? "line-through" : "none" }}>{item.title}</span>
          <button data-key={item.title} onClick={remove}>delete</button>
        </li>
      ))}
    </div>
  );
};

interface TodoItemViewProps {
  holder: TodoItemHolder;
}