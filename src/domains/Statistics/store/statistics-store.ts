import { makeAutoObservable, runInAction } from "mobx";

import type { RootStore } from "@/shared/store/root-store";

import { statisticsRepository } from "../repositories/statisctics-repository";

import type { Statistics } from "../model/statisctics-model";

export class StatisticsStore {
  private _data: Statistics | null = null;
  private _isLoading = false;

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public async getStatistics() {
    this._isLoading = true;

    try {
      const data = await statisticsRepository.getStatistics();

      runInAction(() => {
        this._data = data;
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  get progressStats() {
    if (!this._data) return [];

    return [
      {
        label: "Прошли на 100%",
        value: 50,
        count: 208,
        color: "#92D5FD",
      },
      {
        label: "Еще не просмотрены",
        value: 48,
        count: 200,
        color: "#00D281",
      },
      {
        label: "Наняты",
        value: 2,
        count: 8,
        color: "#FF6AA8",
      },
      {
        label: "Отказ",
        value: 2,
        count: 4,
        color: "#FF6AA8",
      },
    ];
  }

  get data() {
    return this._data;
  }

  get isLoading() {
    return this._isLoading;
  }

  get chartOption() {
    if (!this._data) {
      return {
        series: [],
      } satisfies echarts.EChartsOption;
    }

    return {
      grid: {
        left: 40,
        right: 20,
        top: 40,
        bottom: 30,
      },

      tooltip: {
        trigger: "axis",
      },

      legend: {
        top: 0,
        left: 18,
        icon: "rect",
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 12,
          color: "#000000",
        },
        data: ["Прошли на 100%", "Количество откликов"],
      },

      xAxis: {
        type: "category" as const,
        data: this._data.chartData.map((d) => d.date),

        axisLine: {
          lineStyle: {
            color: "#00000058",
          },
        },

        axisLabel: {
          fontSize: 12,
          color: "#000000",
        },

        axisTick: {
          show: false,
        },
      },

      yAxis: {
        type: "value" as const,

        splitLine: {
          lineStyle: {
            color: "#eee",
            type: "dashed",
          },
        },

        axisLabel: {
          fontSize: 12,
          color: "#000000",
        },
      },

      series: [
        {
          name: "Прошли на 100%",
          type: "bar" as const,
          data: this._data.chartData.map((d) => d.passed),

          barWidth: 21,
          barCategoryGap: 16,
          itemStyle: {
            color: "#5B8FF9",
            borderRadius: [4, 4, 0, 0],
          },

          label: {
            show: true,
            position: "top",
            fontSize: 10,
            color: "#000000",
          },
        },
        {
          name: "Количество откликов",
          type: "bar" as const,
          data: this._data.chartData.map((d) => d.responses),

          barWidth: 21,
          itemStyle: {
            color: "#F6A6A6",
            borderRadius: [4, 4, 0, 0],
          },

          label: {
            show: true,
            position: "top",
            fontSize: 10,
            color: "#000000",
          },
        },
      ],
    } satisfies echarts.EChartsOption;
  }
}
