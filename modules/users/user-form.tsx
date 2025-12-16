"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, PhoneIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useId, useState } from "react";
import MultipleSelector from "@/components/ui/multiselect";
import * as RPNInput from "react-phone-number-input";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslate } from "@/locales";
import flags from "react-phone-number-input/flags";
import { useUsers } from "@/hooks/use-users";

import { isPossiblePhoneNumber } from "react-phone-number-input";
import { SkeletonCurrencyForm } from "../settings/currencies/form";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/paths";
import { toast } from "sonner";
import { getMessageError } from "@/utils/helper";

type Props = {
  userId?: string;
};

const availableRoles = [
  /*  { label: "Usuario", value: "user" }, */
  { label: "Administrador", value: "admin" },
  /*  { label: "Comerciante", value: "merchant" },
  { label: "Superadministrador", value: "admin_superadmin" },
  { label: "Administrador Cliente (solo lectura)", value: "admin_client_read_only" },
  { label: "Administrador Cliente (gestor)", value: "admin_client_manager" },
  { label: "Administrador Configuración (solo lectura)", value: "admin_config_read_only" },
  { label: "Administrador Configuración (gestor)", value: "admin_config_manager" }, */
];

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country | undefined }[];
  isLoading?: boolean;
};

export default function UserForm({ userId }: Props) {
  const [loading, setLoading] = useState(false);
  const id = useId();
  const { t } = useTranslate("users");
  const router = useRouter();

  const formSchema = z.object({
    firstName: z
      .string()
      .min(1, t("form.error.required", { ns: "users" }))
      .max(20, t("form.error.maxLength", { ns: "users", max: 20 })),
    lastName: z
      .string()
      .min(1, t("form.error.required", { ns: "users" }))
      .max(30, t("form.error.maxLength", { ns: "users", max: 30 })),
    email: z.email(t("form.error.email", { ns: "users" })),
    phone: z
      .string()
      .min(1, t("form.error.required", { ns: "users" }))
      .refine((value) => isPossiblePhoneNumber(value), {
        message: t("form.error.phone", { ns: "users" }),
      }),
    roles: z.array(z.string()).min(1, t("form.error.required", { ns: "users" })),
  });

  type FormData = z.infer<typeof formSchema>;

  const { getCountries, getUserByIdQuery, create, emailVerification, update } = useUsers();

  const { data: countries = [], isLoading } = getCountries();
  const { data: user, isLoading: isLoadingUser } = getUserByIdQuery(userId);

  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const countryOptions = countries.map((country: { code: string; name: string }) => ({
    label: country.name,
    value: country.code,
  }));

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      roles: [],
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        roles: user.roles || [],
      });
    }
  }, [user, form]);

  useEffect(() => {
    if (!isLoadingUser && userId && !user) {
      toast.error("Error al cargar usuario");
      router.push(paths.users.root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingUser, user, userId]);

  const checkEmailAvailability = async (email: string) => {
    setCheckingEmail(true);
    try {
      await emailVerification.mutateAsync(email, {
        onSuccess: (value) => {
          if (value.available) {
            setEmailAvailable(true);
          } else {
            setEmailAvailable(false);
            form.setError("email", {
              type: "manual",
              message: t("form.error.emailTaken", { ns: "users" }),
            });
          }
        },
        onError: () => {
          setEmailAvailable(false);
          form.setError("email", {
            type: "manual",
            message: t("form.error.emailTaken", { ns: "users" }),
          });
        },
      });
    } catch (error) {
      console.error("Error checking email:", error);
    } finally {
      setCheckingEmail(false);
    }
  };

  const onSubmit = async (values: FormData) => {
    const isEmailValid = !form.getFieldState("email").invalid;

    if (!emailAvailable && isEmailValid && !userId) {
      form.setError("email", {
        type: "manual",
        message: t("form.error.emailTaken", { ns: "users" }),
      });
      return;
    }

    try {
      setLoading(true);

      if (userId) {
        await update.mutateAsync({ id: userId, data: values });
        toast.success(t("messages.updated", { ns: "users" }));
      } else {
        await create.mutateAsync(values);
        toast.success(t("messages.created", { ns: "users" }));
      }

      router.push(paths.users.root);
    } catch (error) {
      console.error("Error al guardar:", error);
      const message = getMessageError(error);
      toast.error(t(message, { ns: "users" }));
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingUser && userId) {
    return <SkeletonCurrencyForm />;
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="border-b !pb-3">
        <CardTitle>
          {!userId ? t("createUser", { ns: "users" }) : t("editUser", { ns: "users" })}
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.firstName", { ns: "users" })}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("form.placeholderName", { ns: "users" })} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.lastName", { ns: "users" })}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.placeholderLastName", { ns: "users" })}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.email", { ns: "users" })}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder={t("form.placeholderEmail", { ns: "users" })}
                        value={field.value}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          field.onChange(newValue);
                          setEmailAvailable(null);
                          form.clearErrors("email");
                        }}
                        onBlur={async (e) => {
                          field.onBlur();
                          const value = e.target.value;

                          if (!value) return;
                          await checkEmailAvailability(value);
                          const errorState = form.getFieldState("email");
                          if (emailAvailable && errorState.error?.type === "manual") {
                            form.clearErrors("email");
                          }
                        }}
                      />

                      {checkingEmail && (
                        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 animate-spin text-muted-foreground -translate-y-1/2" />
                      )}
                    </div>
                  </FormControl>
                  {emailAvailable === true && (
                    <p className="text-xs text-green-600">
                      {t("form.emailAvailable", { ns: "users" })}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="*:not-first:mt-2" dir="ltr">
                      <RPNInput.default
                        className="flex rounded-full shadow-xs gap-2"
                        international
                        flagComponent={FlagComponent}
                        countrySelectComponent={(props) => (
                          <CountrySelect
                            {...props}
                            options={countryOptions}
                            disabled={isLoading}
                            isLoading={isLoading}
                          />
                        )}
                        inputComponent={PhoneInput}
                        id={id}
                        placeholder={t("form.inputPhone.phoneNumber", { ns: "users" })}
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue ?? "")}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.roles", { ns: "users" })}</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      value={availableRoles.filter((role) => field.value.includes(role.value))}
                      onChange={(selected) => field.onChange(selected.map((item) => item.value))}
                      defaultOptions={availableRoles}
                      placeholder={t("form.selectRoles", { ns: "users" })}
                      commandProps={{
                        label: t("form.selectRoles", { ns: "users" }),
                      }}
                      emptyIndicator={
                        <p className="text-center text-sm text-muted-foreground">
                          {t("form.selectRoles", { ns: "users" })}
                        </p>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => router.push(paths.users.root)}>
          {t("form.cancel", { ns: "users" })}
        </Button>
        <Button type="submit" disabled={loading} onClick={form.handleSubmit(onSubmit)}>
          {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          {t("form.save", { ns: "users" })}
        </Button>
      </CardFooter>
    </Card>
  );
}

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="w-5 overflow-hidden rounded-sm">
      {Flag ? <Flag title={countryName} /> : <PhoneIcon size={16} aria-hidden="true" />}
    </span>
  );
};

const CountrySelect = ({ disabled, value, onChange, options, isLoading }: CountrySelectProps) => {
  const { t } = useTranslate(["users"]);
  return (
    <Select
      disabled={disabled || isLoading}
      value={value}
      onValueChange={(val) => onChange(val as RPNInput.Country)}
    >
      <SelectTrigger className="rounded-full border-input bg-background text-sm text-muted-foreground focus:ring-ring/50">
        <div className="flex items-center gap-2">
          <SelectValue
            placeholder={
              isLoading
                ? t("form.inputPhone.loading", { ns: "users" })
                : t("form.inputPhone.selectCountry", { ns: "users" })
            }
          />
        </div>
      </SelectTrigger>

      <SelectContent className="max-h-64 overflow-y-auto">
        {isLoading ? (
          <SelectItem value="loading" disabled>
            <span className="text-muted-foreground">
              {t("form.inputPhone.loading", { ns: "users" })}
            </span>
          </SelectItem>
        ) : (
          options
            .filter((x) => x.value)
            .map((option, i) => (
              <SelectItem key={option.value ?? `empty-${i}`} value={option.value!}>
                <div className="flex items-center gap-2">
                  <FlagComponent country={option.value!} countryName={option.label} />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))
        )}
      </SelectContent>
    </Select>
  );
};

const PhoneInput = ({ className, ...props }: React.ComponentProps<"input">) => {
  return (
    <Input
      data-slot="phone-input"
      className={cn("-ms-px rounded-full shadow-none focus-visible:z-10", className)}
      {...props}
    />
  );
};
