"use client";

import { getTokenInfo, resetPassword } from "@/auth/context/jwt";
import { Form, FormField, FormControl, FormMessage, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/locales";
import { getMessageError } from "@/utils/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useBoolean } from "@/hooks/use-boolean";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { paths } from "@/routes/paths";
import { useAuthStore } from "@/stores/authStore";

export function ResetPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const token = useSearchParams().get("token");
  const { t } = useTranslate(["common", "errors"]);
  const { logIn } = useAuthStore();

  const [email, setEmail] = useState("");

  const showPassword = useBoolean();
  const showConfirmPassword = useBoolean();

  const router = useRouter();

  const ResetPasswordSchema = z
    .object({
      password: z
        .string()
        .min(6, { message: t("resetPassword.form.errorPassword", { ns: "common" }) }),
      confirmPassword: z
        .string()
        .min(6, { message: t("resetPassword.form.errorPassword", { ns: "common" }) }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("resetPassword.form.errorPasswordMatch", { ns: "common" }),
    });

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        const { email } = await getTokenInfo(token!);
        setEmail(email);
      } catch (error) {
        console.error("Error getting token info:", error);
        const description = getMessageError(error);
        toast.error(t("resetPassword.form.error", { ns: "errors" }), {
          description: t(`error.${description}`, { ns: "errors" }),
        });
        router.push(paths.auth.login);
      }
    };

    if (token) {
      fetchTokenInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!token) {
      router.push(paths.auth.login);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token) return null;

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    try {
      const payload = {
        email,
        password: values.password,
        token,
      };

      const res = await resetPassword(payload);
      document.cookie = `auth-token=${res.accessToken}; path=/; secure; sameSite=lax`;
      logIn(res.accessToken, res.refreshToken);
      router.push(paths.dashboard.root);
      toast.success(t("resetPassword.form.success", { ns: "commons" }));
    } catch (error) {
      const message = getMessageError(error);
      toast.error(t("resetPassword.form.error", { ns: "errors" }), {
        description: t(`error.${message}`, { ns: "errors" }),
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <h1 className="text-xl text-center">{t("resetPassword.title", { ns: "common" })}</h1>

        <div className="relative w-full flex flex-col gap-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type={showPassword.value ? "text" : "password"}
                    placeholder={t("resetPassword.form.newPassword")}
                    className="rounded-full w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            onClick={showPassword.onToggle}
            variant="ghost"
            size="icon"
            className="absolute right-1 top-0.5 h-8 w-8 rounded-full p-0"
          >
            {showPassword.value ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        <div className="relative w-full flex flex-col gap-2">
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type={showConfirmPassword.value ? "text" : "password"}
                    placeholder={t("resetPassword.form.confirmPassword")}
                    className="rounded-full w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            onClick={showConfirmPassword.onToggle}
            variant="ghost"
            size="icon"
            className="absolute right-1 top-0.5 h-8 w-8 rounded-full p-0"
          >
            {showConfirmPassword.value ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex flex-row gap-3 justify-between">
          <Button
            type="button"
            onClick={() => router.push(paths.auth.login)}
            variant="outline"
            className="w-full max-w-[45%] rounded-full border-primary text-primary hover:text-primary hover:bg-primary/10"
          >
            {t("forgot.back")}
          </Button>
          <Button type="submit" className="w-full max-w-[45%] rounded-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            {t("forgot.form.submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
