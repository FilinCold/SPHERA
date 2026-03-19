import { makeAutoObservable, runInAction } from "mobx";

import { restProviderInstance } from "../../../shared/api/restProviderInstance";
import { todosRepository } from "../repositories/todos-repository";

import type { RootStore } from "../../../shared/store/root-store";
import type { Todo } from "../model/todos-model";
import type { TodosRepository } from "../repositories/todos-repository";

export class TodoStore {
  private _todos: Todo[];
  private _isLoading: boolean;
  private _error: string | null;
  private _todosRepository: TodosRepository;
  private _titleTodo: string;

  constructor(private readonly root: RootStore) {
    this._todosRepository = todosRepository;
    this._error = null;
    this._isLoading = false;
    this._todos = [];
    this._titleTodo = "";

    makeAutoObservable(this, {}, { autoBind: true });
  }

  public async getTodos() {
    this._isLoading = true;
    this._error = null;

    try {
      const todos = await this._todosRepository.getTodos();

      runInAction(() => {
        this._todos = todos;
      });
    } catch (error) {
      runInAction(() => {
        this._error = error instanceof Error ? error.message : "Неизвестная ошибка";
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  public async createTodo() {
    if (this.titleTodo) {
      await this._todosRepository.createTodo(this.titleTodo);
    }
  }

  // Получение списка дел
  get todos() {
    return this._todos;
  }

  // Флаг загрузки списка
  get isLoading() {
    return this._isLoading;
  }

  // Получение ошибки получения списка дел
  get error() {
    return this._error;
  }

  // Добавление новой задачи
  public setTitleTodo(titleTodo: string) {
    runInAction(() => {
      this._titleTodo = titleTodo;
    });
  }

  // Заголовок задачи
  get titleTodo() {
    return this._titleTodo;
  }
}
