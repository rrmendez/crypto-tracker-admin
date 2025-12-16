"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { forgotPassword } from "@/auth/context/jwt";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/paths";
import { toast } from "sonner";
import { getMessageError } from "@/utils/helper";
import { Loader2 } from "lucide-react";
import { useTranslate } from "@/locales";

// ----------------------------------------------------------------------

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();

  const { t } = useTranslate(["commons", "errors"]);

  const formSchema = z.object({
    email: z
      .email({ message: t("forgot.form.email.invalid") })
      .min(1, { message: t("forgot.form.email.required") })
      .max(70, { message: t("forgot.form.email.max") }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "", // rrmendez900528@gmail.coms
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await forgotPassword(values);

      toast.success(t("forgot.success"));

      form.reset();
    } catch (error) {
      console.error(error);

      const description = getMessageError(error);

      toast.error(t("forgot.error"), { description });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={t("forgot.form.email.root")}
                    className="rounded-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row gap-3 justify-between">
            <Button
              type="button"
              onClick={() => router.push(paths.auth.login)}
              variant="outline"
              className="w-full max-w-[45%] rounded-full border-primary text-primary hover:text-primary hover:bg-primary/10"
            >
              {t("forgot.back")}
            </Button>
            <Button
              type="submit"
              className="w-full max-w-[45%] rounded-full"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="animate-spin" />}
              {t("forgot.form.submit")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
