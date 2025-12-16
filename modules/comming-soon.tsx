"use client";

import { useTranslate } from "@/locales";
import { Clock } from "lucide-react";

export default function CommingSoon() {
  const { t } = useTranslate();
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <div className="text-center max-w-sm gap-3 flex flex-col items-center justify-center">
        <Clock size={80} className="text-amber-500 mb-2" />
        <h1 className="text-3xl font-bold text-amber-400">{t("commingSoon.title")}</h1>
        <p className="text-muted-foreground">{t("commingSoon.description")}</p>
      </div>
    </div>
  );
}
