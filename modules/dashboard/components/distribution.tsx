"use client";

import { PieChart, Pie } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useDashboard } from "@/hooks/use-dashboard";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslate } from "@/locales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ----------------------------------------------------------------------

const COLORS = [
  // original base colors
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  // additional distinct colors to reach 20
  "#1f77b4",
  "#aec7e8",
  "#d62728",
  "#ff9896",
  "#9467bd",
  "#c5b0d5",
  "#8c564b",
  "#c49c94",
  "#e377c2",
  "#f7b6d2",
  "#7f7f7f",
  "#c7c7c7",
  "#bcbd22",
  "#dbdb8d",
  "#17becf",
  "#9edae5",
];

export default function Distribution() {
  const { t } = useTranslate(["dashboard"]);

  const { queryWalletsBalances } = useDashboard();

  const { data: walletsBalances, isLoading: isLoadingWalletsBalances } = queryWalletsBalances;

  // chart data for clients
  const chartData = useMemo(() => {
    if (!walletsBalances) return [];

    return walletsBalances?.map((balance, index) => ({
      ...balance,
      usdBalance: Number(balance.usdBalance),
      label: `${balance.code} (${balance.networkCode})`,
      fill: COLORS[index % COLORS.length],
    }));
  }, [walletsBalances]);

  const chartConfig = {
    visitors: { label: "Visitors" },
    chrome: { label: "Chrome", color: "var(--chart-1)" },
    safari: { label: "Safari", color: "var(--chart-2)" },
    firefox: { label: "Firefox", color: "var(--chart-3)" },
    edge: { label: "Edge", color: "var(--chart-4)" },
    other: { label: "Other", color: "var(--chart-5)" },
  } satisfies ChartConfig;

  // total balances
  const totals = useMemo(() => {
    return chartData.reduce((acc, item) => acc + +item.usdBalance, 0);
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-center">
            {t("clients.walletDistribution", { ns: "dashboard" })}
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full max-w-[600px]">
          {isLoadingWalletsBalances || (!isLoadingWalletsBalances && totals === 0) ? (
            <div className="relative flex items-center justify-center w-full max-w-[200px] sm:max-w-[220px] aspect-square">
              <Skeleton className="w-full aspect-square rounded-full" />
              {totals === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs sm:text-sm text-muted-foreground text-center px-2">
                    {t("clients.noDataFound", { ns: "dashboard" })}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="relative w-full max-w-[220px] min-w-[200px] aspect-square [&_.recharts-pie-label-text]:fill-foreground"
            >
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartData}
                  dataKey="usdBalance"
                  nameKey="label"
                  stroke="0"
                  outerRadius="100%"
                />
              </PieChart>
            </ChartContainer>
          )}

          <div
            className="
    grid 
    grid-cols-2 md:flex md:flex-col 
    justify-start gap-2 md:space-y-2 
    w-full max-w-[250px] 
    max-h-[210px] 
    overflow-y-auto 
    scrollableDiv 
    sm:pl-0 md:pl-2
    scroll-py-2
  "
          >
            {chartData.map((item) => (
              <div
                key={item.currencyId}
                className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground"
              >
                <span
                  className="inline-block w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.fill }}
                />
                <div className="flex flex-wrap items-center gap-1">
                  <span className="font-medium text-foreground capitalize">{item.code}</span>
                  <span className="text-xs text-muted-foreground">({item.networkCode})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
