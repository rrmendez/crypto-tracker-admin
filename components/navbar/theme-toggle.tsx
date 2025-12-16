"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div>
      <Toggle
        variant="outline"
        className={cn(
          "max-sm:hidden group size-8.5 rounded-full border-none shadow-none",
          "bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground relative",
          "data-[state=on]:bg-primary/10 data-[state=on]:hover:bg-[var(--primary-600)] data-[state=on]:text-primary data-[state=on]:hover:text-primary-foreground"
        )}
        pressed={theme === "dark"}
        onPressedChange={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {/* Note: After dark mode implementation, rely on dark: prefix rather than group-data-[state=on]: */}
        <MoonIcon
          className="shrink-0 !w-5 !h-5 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
          aria-hidden="true"
        />
        <SunIcon
          className="absolute shrink-0 !w-5 !h-5 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
          aria-hidden="true"
        />
      </Toggle>
    </div>
  );
}
