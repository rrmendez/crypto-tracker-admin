"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { I18nProvider, LanguageValue } from "@/locales";
import { CONFIG } from "@/config/global";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

// ----------------------------------------------------------------------

export function Providers({ children, lang }: { lang: LanguageValue; children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <I18nProvider lang={CONFIG.isStaticExport ? undefined : lang}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {/* <AuthProvider>{children}</AuthProvider> */}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </I18nProvider>
  );
}
