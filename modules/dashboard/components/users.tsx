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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Users() {
  const { t } = useTranslate(["dashboard"]);

  // get query clients
  const { queryClients } = useDashboard();
  const { data: clients, isLoading: isLoadingClients } = queryClients;

  // chart data for clients
  const chartData = useMemo(() => {
    if (!clients) return [];

    return clients?.map((client, index) => ({
      ...client,
      role: t(`clients.type.${client.role}`),
      fill: COLORS[index % COLORS.length],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients]);

  // configure chart
  const chartConfig = {
    Administradores: { label: "Administradores", color: "var(--chart-1)" },
    Clientes: { label: "Clientes", color: "var(--chart-2)" },
    firefox: { label: "Firefox", color: "var(--chart-3)" },
  } satisfies ChartConfig;

  // total clients
  const totalClients = useMemo(() => {
    return chartData.reduce((acc, item) => acc + item.quantity, 0);
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-center">
            {t("clients.title", { ns: "dashboard" })}
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full max-w-[600px]">
          {isLoadingClients || (!isLoadingClients && totalClients === 0) ? (
            <div className="relative flex items-center justify-center w-full max-w-[200px] sm:max-w-[220px] aspect-square">
              <Skeleton className="w-full aspect-square rounded-full" />
              {totalClients === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs sm:text-sm text-muted-foreground text-center px-2">
                    {t("clients.noClientFound", { ns: "dashboard" })}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="relative w-full max-w-[220px] min-w-[200px] aspect-square [&_.recharts-pie-label-text]:fill-foreground"
            >
              <PieChart width={220} height={220}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartData}
                  dataKey="quantity"
                  nameKey="role"
                  stroke="0"
                  outerRadius="100%"
                />
              </PieChart>
            </ChartContainer>
          )}

          <div
            className="
          grid grid-cols-2 md:flex md:flex-col 
          justify-center gap-2 md:space-y-2 
          w-full max-w-[250px] 
          max-h-[210px] 
          overflow-y-auto 
          scrollableDiv 
          sm:pl-0 md:pl-2
        "
          >
            {chartData.map((item) => (
              <div
                key={item.role}
                className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground"
              >
                <span
                  className="inline-block w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.fill }}
                />
                <div className="flex flex-wrap items-center gap-1">
                  <span className="font-medium text-foreground capitalize">{item.role}</span>
                  <span className="text-xs text-muted-foreground">({item.quantity})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
