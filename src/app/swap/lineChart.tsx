"use client";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function LineChart() {
  return (
    <Card border="700" className="py-4 px-2 rounded-md">
      <CardContent>
        <ChartContainer className="h-[400px] w-full" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid stroke="#424242" vertical={true} horizontal={true} />
            <XAxis
              dataKey="month"
              tickLine={true}
              axisLine={true}
              tickMargin={12}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="desktop"
              type="linear"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full pt-4 justify-end gap-2 text-sm">
          <Tabs defaultValue="24H">
            <TabsList colors="muted" className="w-[200px]" display="grow">
              <TabsTrigger display="grow" value="24h">
                24H
              </TabsTrigger>
              <TabsTrigger display="grow" value="7D">
                7D
              </TabsTrigger>
              <TabsTrigger display="grow" value="30D">
                30D
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardFooter>
    </Card>
  );
}
