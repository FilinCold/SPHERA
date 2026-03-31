import { makeAutoObservable, runInAction } from "mobx";

import type { RootStore } from "@/shared/store/root-store";

import { candidateRepository } from "../repositories/candidate-repository";

import type { Candidate } from "../model/candidate-model";
import type { CandidateRepository } from "../repositories/candidate-repository";

export class CandidateStore {
  private _candidates: Candidate[];
  private _isLoading: boolean;
  private _error: string | null;
  private _candidateRepository: CandidateRepository;

  constructor(private readonly root: RootStore) {
    this._candidateRepository = candidateRepository;

    this._candidates = [];
    this._isLoading = false;
    this._error = null;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  public async getCandidates() {
    this._isLoading = true;
    this._error = null;

    try {
      const candidates = await this._candidateRepository.getCandidates();

      runInAction(() => {
        this._candidates = candidates;
      });
    } catch (error) {
      runInAction(() => {
        this._error = error instanceof Error ? error.message : "Ошибка загрузки кандидатов";
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  public toggleBookmark(id: string) {
    runInAction(() => {
      this._candidates = this._candidates.map((c) =>
        c.id === id ? { ...c, isBookmarked: !c.isBookmarked } : c,
      );
    });
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
