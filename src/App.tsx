import React from 'react';
import './App.css';
import {
  TodoV,
} from "./list/TodoV";
import {
  CategoryView,
} from "./nav/CategoryView";
import {
  Category,
} from "./nav/Category";

export const App = () => {
  Category.use();
  return (<>
    <h1>Todos</h1>
    <CategoryView />
    <TodoV />
  </>);
};
