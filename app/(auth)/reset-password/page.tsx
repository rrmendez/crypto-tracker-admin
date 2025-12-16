"use client";

import { AppLogoWithTextDark } from "@/components/custom/vectors";
import { Card, CardContent } from "@/components/ui/card";
import { ResetPasswordForm } from "@/modules/auth/reset/reset-form";

export default function ResetPasswordPage() {
  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center z-10">
        <AppLogoWithTextDark className="h-28 w-auto" />
      </div>
      <Card className="w-full max-w-sm z-10 bg-background dark:bg-muted/80">
        <CardContent>
          <ResetPasswordForm className="p-4" />
        </CardContent>
      </Card>
    </>
  );
}
