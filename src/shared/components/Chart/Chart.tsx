"use client";

import * as echarts from "echarts";
import { useEffect, useRef } from "react";

import type { ChartProps } from "./types";

export const Chart = ({ option }: ChartProps) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current);

    chartInstance.current.setOption(option);

    const resizeObserver = new ResizeObserver(() => {
      chartInstance.current?.resize();
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    chartInstance.current?.setOption(option);
  }, [option]);

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
};
