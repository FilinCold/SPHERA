import { RestProvider } from "@/shared/api/restProvider";

import type { Candidate } from "../model/candidate-model";

export class CandidateRepository {
  private _restProvider: RestProvider;

  constructor() {
    this._restProvider = new RestProvider({
      baseUrl: "/api",
    });
  }

  public async getCandidates(): Promise<Candidate[]> {
    try {
      const AVATAR = "/globe.svg";

      return [
        {
          id: "1",
          name: "Имя Фамилия",
          profession: "Менеджер по продажам",
          avatar: AVATAR,
          progress: 75,
          dateOfResponse: "27.03.2026",
          isBookmarked: false,
          courseInProgress: "Всё о продажах",
        },
        {
          id: "2",
          name: "Супер Фронтендер",
          profession: "Король Фронтенда",
          avatar: AVATAR,
          progress: 7,
          dateOfResponse: "26.03.2026",
          isBookmarked: true,
          courseInProgress: "Фронтенд для начинающих",
        },
        {
          id: "3",
          name: "Лучший кандидат",
          profession: "Лучшая работа в мире",
          avatar: AVATAR,
          progress: 54,
          dateOfResponse: "20.03.2026",
          isBookmarked: true,
          courseInProgress: "Как хорошо пройти собес",
        },
      ];
    } catch (error) {
      return [];
    }
  }
}

export const candidateRepository = new CandidateRepository();
