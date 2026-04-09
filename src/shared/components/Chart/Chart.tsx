"use client";

import * as echarts from "echarts";
import { useEffect, useRef } from "react";

import type { ChartProps } from "./types";

export const Chart = ({ option }: ChartProps) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [option]);

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
};
