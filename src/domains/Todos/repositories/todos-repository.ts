import { randomUUID } from "crypto";

import { uuid } from "zod";
import { uuidv4 } from "zod/mini";

import { RestProvider } from "@/shared/api/restProvider";

import type { CreateTodo, TodoRequest } from "../model/todos-model";

export class TodosRepository {
  // Провайдер запросов
  private _restProvider: RestProvider;

  constructor() {
    // т.к. у нас 1 ручка для всех запросов, то исп. restProviderInstance
    // в случае подключения сторонних api исп. такой вариант как ниже
    this._restProvider = new RestProvider({ baseUrl: "https://dummyjson.com" });
  }

  // Получение списка дел
  public async getTodos() {
    try {
      const todos = await this._restProvider.get<TodoRequest>("/todos?limit=300");

      return todos?.todos ?? [];
    } catch (error) {
      //TODO: Добавить логгер
      return [];
    }
  }

  public async createTodo(title: string) {
    try {
      const res = await this._restProvider.post<CreateTodo, Partial<CreateTodo>>("/todos/add", {
        todo: title,
        completed: false,
        userId: 12,
      });

      if (res.id) {
        return { message: "Задача добавлена" };
      }
    } catch (error) {
      //TODO: Добавить логгер
      return { message: "Задачу добавить не удалось" };
    }
  }
}

export const todosRepository = new TodosRepository();
