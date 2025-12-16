"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslate } from "@/locales";
import { Limit } from "@/types/limit";
import { useSearchParams } from "next/navigation";

interface OperationsAccordionProps {
  data?: Limit[];
}

export function OperationsAccordion({ data }: OperationsAccordionProps) {
  const { t } = useTranslate("limits");
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  const formatLimit = (value?: string | number) => {
    if (value == "-1.0" || value == -1.0) return t("unlimited", { ns: "limits" });
    return value;
  };

  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      {data?.map((item) => (
        <Accordion type="single" collapsible key={item.id} className="w-full">
          <AccordionItem
            value={item.id}
            className="rounded-lg border border-border bg-card text-card-foreground shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <AccordionTrigger className="p-4 text-left font-semibold hover:no-underline [&[data-state=open]]:bg-accent/50 rounded-t-lg">
              <span className="flex-1 text-lg tracking-wide">
                {t(`operations.${item.operation}`, { ns: "limits" })}
              </span>
              <span className="text-sm font-medium text-primary ml-4 border border-primary/20 bg-primary/10 py-1 px-3 rounded-full">
                {item.currencyCode}
              </span>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-2 border-t border-border/70 bg-muted/20 rounded-b-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-12 px-2">
                <div className="space-y-2">
                  <h3 className="font-semibold text-xs text-foreground border-b border-border/70 pb-1 mb-2">
                    {t("limitInfo.day", { ns: "limits" })}
                  </h3>

                  <p className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {t("limitInfo.minPerOperation", { ns: "limits" })}:
                    </span>
                    <span className="font-mono text-primary font-semibold">
                      {formatLimit(item.minimumPerOperation)}
                    </span>
                  </p>

                  <p className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {t("limitInfo.maxPerOperation", { ns: "limits" })}:
                    </span>
                    <span className="font-mono text-foreground font-semibold">
                      {formatLimit(
                        verified === "true"
                          ? item.maximumPerOperationValidated
                          : item.maximumPerOperation
                      )}
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-xs text-foreground border-b border-border/70 pb-1 mb-2">
                    {t("limitInfo.night", { ns: "limits" })}
                  </h3>

                  <p className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {t("limitInfo.minPerOperation", { ns: "limits" })}:
                    </span>
                    <span className="font-mono text-primary font-semibold">
                      {formatLimit(item.minimumPerOperation)}
                    </span>
                  </p>

                  <p className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {t("limitInfo.maxPerOperation", { ns: "limits" })}:
                    </span>
                    <span className="font-mono text-foreground font-semibold">
                      {formatLimit(
                        verified === "true"
                          ? item.maximumPerOperationAtNightValidated
                          : item.maximumPerOperationAtNight
                      )}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/70">
                <p className="flex justify-between items-center px-2">
                  <span className="text-muted-foreground">
                    {t("limitInfo.maxPerMonth", { ns: "limits" })}:
                  </span>
                  <span className="font-mono text-primary font-semibold">
                    {formatLimit(
                      verified === "true" ? item.maximumPerMonthValidated : item.maximumPerMonth
                    )}
                  </span>
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
}
