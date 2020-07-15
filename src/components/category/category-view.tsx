import React, {
  FC,
  useCallback,
} from "react";
import {
  CategoryHolder,
} from "./category-holder";

export const CategoryView: FC = () => {
  const addCategory = useCallback(CategoryHolder.add, []);
  const selectCategory = useCallback(CategoryHolder.select, []);
  const removeCategory = useCallback(CategoryHolder.remove, []);
  return (
    <div>
      <input
        placeholder={"input new category"}
        onKeyDown={addCategory} />
      <ul>
        {CategoryHolder.category.map((cate) => (
          <li key={cate}>
            <span data-key={cate} onClick={selectCategory}>{cate}</span>
            <button data-key={cate} onClick={removeCategory}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
