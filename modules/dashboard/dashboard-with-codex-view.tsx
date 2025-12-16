"use client";

import * as React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QrCodeViewer from "@/components/qr-code-viewer";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

// ----------------------------------------------------------------------

const portfolioDistribution = [
  { name: "USBB", value: 30 },
  { name: "USDT", value: 37 },
  { name: "USDP", value: 15 },
  { name: "Otros", value: 18 },
];

const usersDistribution = [
  { name: "Empresa", value: 100 },
  { name: "Persona", value: 50 },
];

const wallets = [
  { key: "gas", title: "Wallet de Gas", balance: "5000 USDT", showQr: true },
  { key: "fees", title: "Wallet de Tasas", balance: "5000 USDT" },
  { key: "trading", title: "Wallet de Compra e Venda", balance: "5000 USDT" },
];

const market = [
  { symbol: "BTC", price: 100_000, change: 25 },
  { symbol: "USDT", price: 100_000, change: 75 },
  { symbol: "USBB", price: 100_000, change: -25 },
  { symbol: "USDP", price: 100_000, change: -0.5 },
];

const recentTotals = {
  deposits: 10_000_000,
  transfers: 1_000_000,
};

// Definimos colores hex (compatibles con Recharts) y los exponemos via
// ChartContainer como variables CSS: var(--color-<key>), siguiendo el ejemplo.
const chartConfig: ChartConfig = {
  USBB: { label: "USBB", color: "#2563eb" },
  USDT: { label: "USDT", color: "#60a5fa" },
  USDP: { label: "USDP", color: "#22c55e" },
  Otros: { label: "Otros", color: "#a855f7" },
  Empresa: { label: "Empresa", color: "#f59e0b" },
  Persona: { label: "Persona", color: "#ef4444" },
};

function formatMoney(n: number, currency = "USD") {
  return (
    n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
    ` ${currency}`
  );
}

export default function DashboardWithCodexView() {
  return (
    <div className="p-4 space-y-4">
      {/* Top row */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Valor total del portafolio</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-6">
            <div className="text-3xl md:text-4xl font-semibold">{formatMoney(10_000, "USD")}</div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button variant="link" className="px-0">
              Ver detalle
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución del portafolio</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-56">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                <Pie
                  data={portfolioDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={70}
                  strokeWidth={2}
                >
                  {portfolioDistribution.map((item) => (
                    <Cell key={item.name} fill={`var(--color-${item.name})`} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuarios</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
            <ChartContainer config={chartConfig} className="h-56">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                <Pie
                  data={usersDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={35}
                  outerRadius={65}
                  strokeWidth={2}
                >
                  {usersDistribution.map((item) => (
                    <Cell key={item.name} fill={`var(--color-${item.name})`} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="space-y-2 pl-2">
              <div className="flex items-center justify-between">
                <span>Empresa:</span>
                <span className="font-medium">
                  {usersDistribution.find((u) => u.name === "Empresa")?.value}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Persona:</span>
                <span className="font-medium">
                  {usersDistribution.find((u) => u.name === "Persona")?.value}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallets row */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {wallets.map((w) => (
          <Card key={w.key}>
            <CardHeader>
              <CardTitle>{w.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Balance:</div>
                <div className="text-base font-medium">{w.balance}</div>
              </div>
              {w.showQr ? (
                <div className="flex flex-col items-center gap-1">
                  <QrCodeViewer
                    value="0x1234...ABCD"
                    slotProps={{ container: { className: "p-1" } }}
                  />
                  <div className="text-xs text-muted-foreground">Cargar</div>
                </div>
              ) : (
                <Button variant="link" className="px-0">
                  Ver detalle
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Comportamiento del mercado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {market.map((m) => {
                const positive = m.change >= 0;
                return (
                  <div key={m.symbol} className="flex items-center justify-between py-2">
                    <div className="font-medium w-20">{m.symbol}</div>
                    <div className="text-muted-foreground flex-1">
                      {formatMoney(m.price, "USD")}
                    </div>
                    <div
                      className={`flex items-center gap-1 ${positive ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {positive ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      <span>{Math.abs(m.change)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transacciones recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Depósitos:</div>
                <div className="font-mono">{formatMoney(recentTotals.deposits, "USD")}</div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="font-medium">Transferencias:</div>
                <div className="font-mono">{formatMoney(recentTotals.transfers, "USD")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
