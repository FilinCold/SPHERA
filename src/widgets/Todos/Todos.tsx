"use client";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { useStores } from "@/shared/store";

import styles from "./Todos.module.scss";

const TodosComponent = () => {
  const { todoStore } = useStores();
  const isLoading = todoStore.isLoading;

  useEffect(() => {
    todoStore.getTodos();
  }, [todoStore]);

  const onChangeTitleTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    todoStore.setTitleTodo(e.currentTarget.value);
  };

  const onCreateTodo = () => {
    todoStore.createTodo();
    todoStore.getTodos();
  };

  return (
    <div className={styles.container}>
      <div className={styles.createTaskContainer}>
        <input
          className={styles.inputTodo}
          type="text"
          onChange={(e) => onChangeTitleTodo(e)}
          value={todoStore.titleTodo}
        />
        <button
          onClick={onCreateTodo}
          disabled={!todoStore.titleTodo}
          className={styles.createTask}
        >
          Добавь задачу
        </button>
      </div>

      <h1>Список дел:</h1>

      <div className={styles.wrapperTodo}>
        {isLoading ? (
          <div>Загрузка списка...</div>
        ) : (
          <div>
            {todoStore?.todos.map((todo) => {
              return <div key={todo.id}>{todo?.todo}</div>;
            })}
          </div>
        )}
        {}
      </div>
    </div>
  );
};

export const Todos = observer(TodosComponent);
