import React from "react";
import { CategoryH } from "./CategoryH";
import { Category } from "./Category";

export const CategoryV = () => {
  const { add, remove, select } = CategoryH;
  return (<nav>
    {[...Category.list].map(key => (<div key={key}>
      <span onClick={select(key)}>{key}</span>
      <span onClick={remove(key)} STYLE="color:red">x</span>
    </div>))}
    <input onKeyDown={add} placeholder="input new category" />
  </nav>);
};
