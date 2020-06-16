import React from 'react';
import './App.css';
import {
  TodoV,
} from "./list/TodoV";
import {
  CategoryV,
} from "./nav/CategoryV";
import {
  Category,
} from "./nav/Category";

export const App = () => {
  Category.use();
  return (<>
    <h1>Todos</h1>
    <CategoryV />
    <TodoV />
  </>);
};
