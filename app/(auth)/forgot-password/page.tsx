"use client";

import { AppLogoWithTextDark } from "@/components/custom/vectors";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/locales";
import { ForgotPasswordForm } from "@/modules/auth/forgot/forgot-form";

export default function ForgotPasswordPage() {
  const { t } = useTranslate();

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center z-10">
        <AppLogoWithTextDark className="h-28 w-auto" />
      </div>
      <Card className="w-full max-w-sm z-10 bg-background dark:bg-muted/80">
        <CardHeader>
          <CardTitle className="text-center">{t("forgot.title")}</CardTitle>
          <CardDescription className="text-center">{t("forgot.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm className="p-4" />
        </CardContent>
      </Card>
    </>
  );
}
