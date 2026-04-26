import { RestProvider } from "@/shared/api/restProvider";

import type { Candidate, CandidateDetails } from "../model/candidate-model";

export class CandidateRepository {
  private _restProvider: RestProvider;

  constructor() {
    this._restProvider = new RestProvider({
      baseUrl: "/api",
    });
  }

  public async getCandidates(): Promise<Candidate[]> {
    const AVATAR = "/globe.svg";

    return [
      {
        id: "1",
        name: "Иван Петров",
        profession: "Менеджер по продажам",
        avatar: AVATAR,
        progress: 75,
        dateOfResponse: "27.03.2026",
        isBookmarked: false,
        courseInProgress: "Все о продажах",
        age: 32,
      },
      {
        id: "2",
        name: "Анна Смирнова",
        profession: "Frontend разработчик",
        avatar: AVATAR,
        progress: 40,
        dateOfResponse: "26.03.2026",
        isBookmarked: true,
        courseInProgress: "React Pro",
        age: 28,
      },
      {
        id: "3",
        name: "Дмитрий Козлов",
        profession: "Backend разработчик",
        avatar: AVATAR,
        progress: 60,
        dateOfResponse: "25.03.2026",
        isBookmarked: false,
        courseInProgress: "Node.js Advanced",
        age: 35,
      },
      {
        id: "4",
        name: "Елена Васильева",
        profession: "UX/UI дизайнер",
        avatar: AVATAR,
        progress: 90,
        dateOfResponse: "24.03.2026",
        isBookmarked: true,
        courseInProgress: "Design Systems",
        age: 30,
      },
      {
        id: "5",
        name: "Сергей Иванов",
        profession: "QA инженер",
        avatar: AVATAR,
        progress: 20,
        dateOfResponse: "23.03.2026",
        isBookmarked: false,
        courseInProgress: "Automation Testing",
        age: 27,
      },
    ];
  }

  public async getCandidateDetails(id: string): Promise<CandidateDetails> {
    return {
      birthDate: "12.12.1992",
      education: "МФТИ Экономический факультет, бакалавр\nСПбГУ Юридический факультет, магистр",
      experience: "ООО Глобус Трейд — менеджер по продажам\nИП Сидоров — продавец",
      skills: "CRM\nРабота с возражениями\nКлиентоориентированность",
      personal: "Коммуникабельность, ответственность, пунктуальность",
      comments: [
        {
          id: "1",
          author: "Пользователь 1",
          text: "Очень сильный кандидат",
        },
      ],
    };
  }
}

export const candidateRepository = new CandidateRepository();
