export type ChartData = {
  date: string;
  passed: number;
  responses: number;
};

export type Statistics = {
  courseName: string;
  totalCandidates: number;
  chartData: ChartData[];
};
