import React from "react";

export const TodoListV = ({ holder }) => {
  const { cat, keydown, remove, toggle, vm: { items } } = holder;
  return (<>
    <h2>{cat}</h2>
    <input onKeyDown={keydown} />
    <ul>
      {[...items].map((item, i) => {
        const deco = item.isComplete ? "text-decoration:line-through" : ""
        return (<li key={i}>
          <span onClick={_ => toggle(item)} STYLE={deco}>{item.title}</span>
          <span onClick={_ => remove(item)}>x</span>
        </li>);
      })}
    </ul>
  </>);
};