import React, {
  FC,
  useCallback,
  KeyboardEvent,
} from "react";
import {
  CategoryModel,
} from "./category-model";
import {
  CategoryHolder,
} from "./category-holder";

export const CategoryView: FC = () => {
  CategoryModel.use();
  const addCategory = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    CategoryHolder.onKeyDown(e);
  }, []);
  return (
    <div>
      <input
        placeholder={"input new category"}
        onKeyDown={addCategory} />
      <ul>
        {CategoryHolder.category.map((cate) => (
          <li key={cate}>
            <span onClick={CategoryHolder.select(cate)}>{cate}</span>
            <button onClick={CategoryHolder.remove(cate)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
