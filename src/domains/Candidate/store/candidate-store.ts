import { makeAutoObservable, runInAction } from "mobx";

import type { RootStore } from "@/shared/store/root-store";

import { candidateRepository } from "../repositories/candidate-repository";

import type { Candidate } from "../model/candidate-model";
import type { Comment } from "../model/candidate-model";

const STORAGE_KEY = "candidates_state";

type StoredCandidateState = {
  id: string;
  isBookmarked: boolean;
  comments: Comment[];
};

export class CandidateStore {
  private _candidates: Candidate[] = [];
  private _isLoading = false;
  private _error: string | null = null;

  private _commentsMap: Record<string, Comment[]> = {};

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private getComments(id: string): Comment[] {
    return this._commentsMap[id] ?? [];
  }

  private saveToStorage() {
    const data: StoredCandidateState[] = this._candidates.map((c) => ({
      id: c.id,
      isBookmarked: c.isBookmarked,
      comments: this.getComments(c.id),
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  private loadFromStorage(): StoredCandidateState[] | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) return null;

      return JSON.parse(raw) as StoredCandidateState[];
    } catch {
      return null;
    }
  }

  async getCandidates() {
    this._isLoading = true;
    this._error = null;

    try {
      const data = await candidateRepository.getCandidates();
      const saved = this.loadFromStorage();

      const commentsMap: Record<string, Comment[]> = {};

      const merged = data.map((c) => {
        const stored = saved?.find((s) => s.id === c.id);

        commentsMap[c.id] = stored?.comments ?? [];

        return {
          ...c,
          isBookmarked: stored?.isBookmarked ?? c.isBookmarked,
        };
      });

      runInAction(() => {
        this._candidates = merged;
        this._commentsMap = commentsMap;
      });
    } catch {
      runInAction(() => {
        this._error = "Ошибка загрузки кандидатов";
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async loadCandidateDetails(id: string) {
    const candidate = this.getCandidateById(id);

    if (!candidate || candidate.details) return;

    try {
      const details = await candidateRepository.getCandidateDetails(id);

      runInAction(() => {
        this._candidates = this._candidates.map((c) =>
          c.id === id
            ? {
                ...c,
                details: {
                  ...details,
                  comments: this.getComments(id),
                },
              }
            : c,
        );
      });
    } catch {
      console.error("Ошибка загрузки деталей кандидата");
    }
  }

  addComment(candidateId: string, text: string) {
    if (!text.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: "Вы",
      text,
    };

    runInAction(() => {
      this._commentsMap[candidateId] = [...this.getComments(candidateId), newComment];

      this._candidates = this._candidates.map((c) => {
        if (c.id !== candidateId) return c;
        if (!c.details) return c;

        return {
          ...c,
          details: {
            ...c.details,
            comments: this.getComments(candidateId),
          },
        };
      });
    });

    this.saveToStorage();
  }

  toggleBookmark(id: string) {
    runInAction(() => {
      this._candidates = this._candidates.map((c) =>
        c.id === id ? { ...c, isBookmarked: !c.isBookmarked } : c,
      );
    });

    this.saveToStorage();
  }

  getCandidateById(id: string) {
    return this._candidates.find((c) => c.id === id);
  }

  get candidates() {
    return this._candidates;
  }

  get isLoading() {
    return this._isLoading;
  }

  get error() {
    return this._error;
  }
}
