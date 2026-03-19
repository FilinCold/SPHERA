export type Todo = {
  completed: boolean;
  id: number;
  todo: string;
  userId: number;
};

export type TodoRequest = {
  limit: number;
  skip: number;
  todos: Todo[];
  total: number;
};

export type CreateTodo = {
  completed: boolean;
  id: number;
  todo: string;
  userId: number;
};
