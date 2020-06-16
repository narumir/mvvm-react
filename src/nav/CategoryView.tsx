import React from "react";
import {
  CategoryHolder,
} from "./CategoryHolder";
import {
  Category,
} from "./Category";

export const CategoryView = () => {
  const {
    add,
    remove,
    select,
  } = CategoryHolder;
  return (
    <nav>
      {[...Category.list].map(key => (
        <div key={key}>
          <span onClick={select(key)}>{key}</span>
          <button onClick={remove(key)}>x</button>
        </div>
      ))}
      <input onKeyDown={add} placeholder="input new category" />
    </nav>
  );
};
