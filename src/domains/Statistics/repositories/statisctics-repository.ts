import type { Statistics } from "../model/statisctics-model";

export class StatisticsRepository {
  public async getStatistics(): Promise<Statistics> {
    return {
      courseName: "Название курса",
      totalCandidates: 330,
      chartData: [
        { date: "12.01", passed: 8, responses: 12 },
        { date: "13.01", passed: 11, responses: 20 },
        { date: "14.01", passed: 27, responses: 15 },
        { date: "15.01", passed: 30, responses: 46 },
        { date: "16.01", passed: 8, responses: 10 },
        { date: "17.01", passed: 15, responses: 8 },
        { date: "18.01", passed: 17, responses: 41 },
        { date: "19.01", passed: 14, responses: 43 },
        { date: "20.01", passed: 5, responses: 36 },
        { date: "21.01", passed: 7, responses: 30 },
        { date: "22.01", passed: 18, responses: 32 },
        { date: "23.01", passed: 25, responses: 37 },
      ],
    };
  }
}

export const statisticsRepository = new StatisticsRepository();
