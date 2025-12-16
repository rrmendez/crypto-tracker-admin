import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useBoolean } from "@/hooks/use-boolean";
import { useTranslate } from "@/locales";
import useProfile from "@/hooks/use-profile";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2, Eye, EyeOff, Loader2, XCircle } from "lucide-react";

export default function ChangePasswordCard() {
  const { t } = useTranslate(["register", "profile"]);
  const { checkCurrentPassword, updatePassword } = useProfile();

  const showCurrentPassword = useBoolean();
  const showPassword = useBoolean();
  const showPasswordConfirmation = useBoolean();

  const checkCurrentPasswordMutation = checkCurrentPassword();
  const updatePasswordMutation = updatePassword();

  const schema = z
    .object({
      currentPassword: z.string().min(8, { message: t("securityTab.required", { ns: "profile" }) }),
      newPassword: z
        .string()
        .min(8, { message: t("securityTab.required", { ns: "profile" }) })
        .refine((val) => /[A-Z]/.test(val), {
          message: t("securityTab.rules.uppercase", { ns: "profile" }),
        })
        .refine((val) => /[0-9]/.test(val), {
          message: t("securityTab.rules.number", { ns: "profile" }),
        })
        .refine((val) => /[^A-Za-z0-9]/.test(val), {
          message: t("securityTab.rules.specialChar", { ns: "profile" }),
        }),
      confirmPassword: z.string().min(8, { message: t("securityTab.required", { ns: "profile" }) }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("securityTab.rules.passwordsMatch", { ns: "profile" }),
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { watch } = form;

  const password = watch("newPassword");

  const passwordCriteria = {
    minLength: password?.length >= 8,
    hasUppercase: /[A-Z]/.test(password || ""),
    hasNumber: /[0-9]/.test(password || ""),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password || ""),
  };

  const onSubmit = (data: z.infer<typeof schema>) => {
    const currentPassword = data.currentPassword;
    const newPassword = data.newPassword;
    checkCurrentPasswordMutation.mutate(currentPassword, {
      onSuccess: () => {
        updatePasswordMutation.mutate(
          { password: currentPassword, newPassword },
          {
            onSuccess: () => {
              toast.success(t("securityTab.success", { ns: "profile" }));
              form.reset();
            },
            onError: (error) => {
              console.error("Error updating password:", error);
            },
          }
        );
      },
      onError: (error) => {
        console.error("Error checking current password:", error);
        form.setError("currentPassword", {
          type: "manual",
          message: t("securityTab.checkingError", { ns: "profile" }),
        });
      },
    });
  };

  const renderCriteria = (condition: boolean, label: string) => (
    <li
      className={`flex items-center gap-2 text-[12px] ${
        condition ? "text-green-600" : "text-muted-foreground"
      }`}
    >
      {condition ? (
        <CheckCircle2 className="h-4 w-4 text-green-600" />
      ) : (
        <XCircle className="h-4 w-4 text-muted-foreground" />
      )}
      {label}
    </li>
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("securityTab.title", { ns: "profile" })}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-4 mx-auto max-w-md" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="relative w-full flex flex-col gap-2">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type={showCurrentPassword.value ? "text" : "password"}
                        placeholder={t("securityTab.placeholderCurrent", { ns: "profile" })}
                        className="rounded-full"
                        {...field}
                        aria-invalid={!!fieldState?.error}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                onClick={showCurrentPassword.onToggle}
                variant="ghost"
                size="icon"
                className="absolute right-1 top-0.5 h-8 w-8 rounded-full p-0"
              >
                {showCurrentPassword.value ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="relative w-full flex flex-col gap-2">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type={showPassword.value ? "text" : "password"}
                        placeholder={t("securityTab.newPassword", { ns: "profile" })}
                        className="rounded-full"
                        {...field}
                        aria-invalid={!!fieldState?.error}
                      />
                    </FormControl>
                    <ul className="mt-2 space-y-1">
                      {renderCriteria(
                        passwordCriteria.minLength,
                        t("securityTab.rules.minLength", { ns: "profile" })
                      )}
                      {renderCriteria(
                        passwordCriteria.hasUppercase,
                        t("securityTab.rules.uppercase", { ns: "profile" })
                      )}
                      {renderCriteria(
                        passwordCriteria.hasNumber,
                        t("securityTab.rules.number", { ns: "profile" })
                      )}
                      {renderCriteria(
                        passwordCriteria.hasSpecialChar,
                        t("securityTab.rules.specialChar", { ns: "profile" })
                      )}
                    </ul>
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
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type={showPasswordConfirmation.value ? "text" : "password"}
                        placeholder={t("securityTab.passwordConfirmation", { ns: "profile" })}
                        className="rounded-full"
                        {...field}
                        aria-invalid={!!fieldState?.error}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                onClick={showPasswordConfirmation.onToggle}
                variant="ghost"
                size="icon"
                className="absolute right-1 top-0.5 h-8 w-8 rounded-full p-0"
              >
                {showPasswordConfirmation.value ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                type="submit"
                disabled={
                  checkCurrentPasswordMutation.isPending || updatePasswordMutation.isPending
                }
              >
                {checkCurrentPasswordMutation.isPending || updatePasswordMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    {t("securityTab.updating", { ns: "profile" })}
                    <Loader2 className="animate-spin" />
                  </span>
                ) : (
                  t("securityTab.update", { ns: "profile" })
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
