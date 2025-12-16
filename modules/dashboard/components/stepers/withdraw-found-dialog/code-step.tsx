"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useBoolean } from "@/hooks/use-boolean";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/locales";
import { getMessageError } from "@/utils/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

interface CodeStepProps {
  onBack: (step: string) => void;
  onNext: (step: string) => void;
  onConfirm: (code: string) => Promise<void>;
}

export default function CodeStep({ onBack, onNext, onConfirm }: CodeStepProps) {
  const { t } = useTranslate(["common", "errors"]);
  const loading = useBoolean();

  const formSchema = z.object({
    code: z
      .string()
      .min(6, { message: t("error.Invalid code", { ns: "errors" }) })
      .max(6, { message: t("error.Invalid code", { ns: "errors" }) }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "" },
  });

  const {
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = form;

  const handleSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      loading.onTrue();
      try {
        await onConfirm(values.code);
        reset();
        onNext("success");
      } catch (error) {
        console.error("Error confirming code:", error);
        const message = getMessageError(error);
        setError("code", { message });
        setValue("code", "");
      } finally {
        loading.onFalse();
      }
    },
    [onConfirm, onNext, reset, setError, setValue, loading]
  );

  return (
    <Card className="bg-background border-0">
      <CardContent>
        <p className="text-center text-sm text-muted-foreground">
          Coloque el código de 6 dígitos para confirmar la transacción
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col">
            <div className="flex flex-col gap-6 pt-4 items-center">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                        {...field}
                        onChange={(value) => {
                          setValue("code", value, { shouldValidate: false });
                          if (errors.code) clearErrors("code");
                        }}
                        onComplete={(value) => {
                          setValue("code", value, { shouldValidate: true });
                          form.handleSubmit(handleSubmit)();
                        }}
                      >
                        <InputOTPGroup className="flex justify-center space-x-3 w-[320px]">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <InputOTPSlot
                              key={i}
                              index={i}
                              className={cn(
                                "w-12 h-12 text-lg border-2 rounded-md transition-all text-center",
                                errors.code
                                  ? "border-destructive"
                                  : "border-gray-300 focus:border-blue-500"
                              )}
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage className="text-center max-w-[320px]" />{" "}
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={() => onBack("details")} disabled={loading.value}>
          {t("whithdraw.detailsStep.back", { ns: "dashboard" })}
        </Button>
        <Button type="submit" onClick={form.handleSubmit(handleSubmit)} disabled={loading.value}>
          {loading.value ? t("loading", { ns: "common" }) : t("confirm", { ns: "common" })}
        </Button>
      </CardFooter>
    </Card>
  );
}
