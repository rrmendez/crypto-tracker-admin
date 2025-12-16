"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/paths";
import { toast } from "sonner";
import { getMessageError } from "@/utils/helper";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useBoolean } from "@/hooks/use-boolean";
import { useTranslate } from "@/locales";
import { useAuthStore } from "@/stores/authStore";
import { signInWithPassword } from "@/auth/actions/jwt-action";
import { jwtDecode } from "jwt-decode";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { useState } from "react";
import use2FA from "@/hooks/use-2fa";

type DecodedToken = {
  type?: string;
};

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const showPassword = useBoolean();
  const { t } = useTranslate(["commons", "errors"]);
  const { logIn } = useAuthStore();
  const { signInWith2FA } = use2FA();
  const signInWith2FAMutation = signInWith2FA();

  const [requires2FA, setRequires2FA] = useState(false);
  const [code, setCode] = useState("");
  const [errorCode, setErrorCode] = useState("");

  const formSchema = z.object({
    email: z
      .email({ message: t("login.form.email.invalid") })
      .min(1, { message: t("login.form.email.required") })
      .max(70, { message: t("login.form.email.max") }),
    password: z
      .string()
      .min(1, { message: t("login.form.password.required") })
      .max(100, { message: t("login.form.password.max") }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await signInWithPassword(values);
      const decoded: DecodedToken = jwtDecode(res.accessToken);

      if (decoded.type === "second_factor") {
        logIn(res.accessToken, res.refreshToken); // Store temp token
        setRequires2FA(true);
        return;
      }

      document.cookie = `auth-token=${res.accessToken}; path=/; secure; sameSite=lax`;
      logIn(res.accessToken, res.refreshToken);
      router.push(paths.dashboard.root);
    } catch (error) {
      const description = getMessageError(error);
      toast.error(t(description, { ns: "errors" }));
    }
  };

  const handleVerify2FA = async () => {
    try {
      signInWith2FAMutation.mutate(code, {
        onSuccess: (res) => {
          setCode("");
          document.cookie = `auth-token=${res.accessToken}; path=/; secure; sameSite=lax`;
          logIn(res.accessToken, res.refreshToken);
          router.push(paths.dashboard.root);
        },
        onError: (error) => {
          setErrorCode(t("auth.2fa.invalidCode", { ns: "errors" }));
          console.log(error);
        },
      });
    } catch (error) {
      toast.error(t("auth.2fa.invalidCode", { ns: "errors" }));
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        {!requires2FA ? (
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={t("login.form.email.root")}
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="relative w-full flex flex-col gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type={showPassword.value ? "text" : "password"}
                        placeholder={t("login.form.password.root")}
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

            <Link
              className="text-primary cursor-pointer text-sm text-right font-medium -mt-2 hover:underline"
              href={paths.auth.forgotPassword}
            >
              {t("login.forgot_password")}
            </Link>

            <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              {t("login.form.submit")}
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            <InputOTP
              id="otp"
              maxLength={6}
              value={code}
              onChange={(value) => {
                const numericValue = value.replace(/\D/g, "");
                setErrorCode("");
                setCode(numericValue);
              }}
              onComplete={handleVerify2FA}
            >
              <div className="flex space-x-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="w-12 h-12 text-lg border-2 border-gray-300 rounded-md focus:border-blue-500 transition-all"
                  />
                ))}
              </div>
            </InputOTP>

            {errorCode && (
              <p className="text-[12px] text-red-500 top-full">
                {t("codeStep.error", { ns: "profile" })}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRequires2FA(false)}
                className="rounded-full"
              >
                {t("login.2fa.back")}
              </Button>
              <Button
                type="button"
                onClick={handleVerify2FA}
                className="rounded-full"
                disabled={signInWith2FAMutation.isPending || code.length < 6}
              >
                {signInWith2FAMutation.isPending && <Loader2 className="animate-spin" />}
                {t("login.2fa.verifyButton")}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
