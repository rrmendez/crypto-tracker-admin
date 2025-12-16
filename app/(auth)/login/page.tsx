"use client";

import { AppLogoWithTextDark } from "@/components/custom/vectors";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/locales";
import { LoginForm } from "@/modules/auth/login/login-form";

export default function LoginPage() {
  const { t } = useTranslate();

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center z-10">
        <AppLogoWithTextDark className="h-28 w-auto" />
      </div>
      <Card className="w-full max-w-sm z-10 bg-background dark:bg-muted/80">
        <CardHeader>
          <CardTitle className="text-center">{t("login.title")}</CardTitle>
          <CardDescription className="text-center">{t("login.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm className="p-4" />
          {/* TODO: Remove this when we have a proper version */}
          <div className="text-xs text-muted-foreground text-right mt-2">v1.0.7</div>
        </CardContent>
      </Card>
    </>
  );
}
