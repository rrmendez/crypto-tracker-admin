"use client";

import { useTranslate } from "@/locales";
import { useTheme } from "next-themes";

export default function Loading() {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslate(["common"]);

  const isDark = resolvedTheme === "dark";
  const bgColor = isDark ? "bg-(--primary-900)" : "bg-(--primary-50)/50";
  const textColor = isDark ? "text-gray-200" : "text-gray-700";

  return (
    <div
      className={`absolute inset-0 ${bgColor} flex flex-col items-center justify-center p-4 transition-opacity duration-300`}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
      <p className={`mt-6 text-lg font-medium ${textColor}`}>{t("loading", { ns: "common" })} </p>
    </div>
  );
}
