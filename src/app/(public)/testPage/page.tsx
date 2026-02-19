"use client";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { useStores } from "@/shared/store";

const TestPage = observer(() => {
  const { todos } = useStores();

  useEffect(() => {
    todos.fetchTodos();
  }, [todos]);

  if (todos.isLoading) {
    return <div>Загрузка...</div>;
  }
  if (todos.error) {
    return <div>Ошибка: {todos.error}</div>;
  }

  return (
    <>
      <ul>
        {todos.todos.map((todo) => (
          <li key={todo.id}>
            <h2>Задание: {todo.title}</h2>
            <h3>Выполнено: {todo.completed ? "Да" : "Нет"}</h3>
          </li>
        ))}
      </ul>
    </>
  );
});

export default TestPage;
