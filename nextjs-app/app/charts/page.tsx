"use client";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, CartesianGrid } from "recharts";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Monitor } from "lucide-react";
import { ChartAreaInteractive } from "@/components/demo-charts/area-chart";
import { Suspense, useEffect } from "react";

export default function ShadCharDemo(props) {
  console.log("ShadCharDemo props: ", props);
  // 1. get you want to render data
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  // 2. create chart config
  const chartConfig = {
    desktop: {
      label: "Desktop",
      icon: Monitor,
      color: "var(--chart-1)",
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <div className=" mx-4">
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          {/* 网格 */}
          <CartesianGrid vertical={false} />
          {/* x 轴 */}
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          {/* tooltip */}
          <ChartTooltip content={<ChartTooltipContent />} />

          {/* 图表图例： 展示 chart config 中定义的 label */}
          <ChartLegend content={<ChartLegendContent />} />

          <Bar dataKey="desktop" fill="var(--chart-1)" radius={4} />
          <Bar dataKey="mobile" fill="var(--chart-2)" radius={4} />
        </BarChart>
      </ChartContainer>

      <Suspense fallback={"loading..."}>
        <ChartAreaInteractive />
      </Suspense>
    </div>
  );
}
