"use client";

import { useUsers } from "@/hooks/use-users";
import { useTranslate } from "@/locales";
import { useRouter } from "next/navigation";
import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { SkeletonCurrencyForm } from "../settings/currencies/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as RPNInput from "react-phone-number-input";
import MultipleSelector from "@/components/ui/multiselect";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import flags from "react-phone-number-input/flags";
import { PhoneIcon } from "lucide-react";
import { paths } from "@/routes/paths";
import { toast } from "sonner";

type Props = {
  userId?: string;
};

const availableRoles = [
  { label: "Usuario", value: "user" },
  { label: "Administrador", value: "admin" },
  { label: "Comerciante", value: "merchant" },
  { label: "Superadministrador", value: "admin_superadmin" },
  { label: "Administrador Cliente (solo lectura)", value: "admin_client_read_only" },
  { label: "Administrador Cliente (gestor)", value: "admin_client_manager" },
  { label: "Administrador Configuración (solo lectura)", value: "admin_config_read_only" },
  { label: "Administrador Configuración (gestor)", value: "admin_config_manager" },
];

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roles: string[];
};

export default function DetailsForm({ userId }: Props) {
  const id = useId();
  const { t } = useTranslate("users");
  const router = useRouter();
  const { getCountries, getUserByIdQuery } = useUsers();

  const { data: countries = [], isLoading } = getCountries();
  const { data: user, isLoading: isLoadingUser } = getUserByIdQuery(userId);

  const form = useForm<FormData>({
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

  const countryOptions = countries.map((country: { code: string; name: string }) => ({
    label: country.name,
    value: country.code,
  }));

  if (isLoadingUser && userId) {
    return <SkeletonCurrencyForm />;
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="border-b !pb-3">
        <CardTitle>{t("breadcrumb.details", { ns: "users" })}</CardTitle>
        <CardDescription />
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.firstName", { ns: "users" })}</FormLabel>
                  <FormControl>
                    <Input readOnly {...field} />
                  </FormControl>
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
                    <Input readOnly {...field} />
                  </FormControl>
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
                    <Input readOnly type="email" {...field} />
                  </FormControl>
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
                        value={field.value}
                        onChange={() => {}}
                        readOnly
                        flagComponent={FlagComponent}
                        countrySelectComponent={(props) => (
                          <CountrySelect
                            {...props}
                            options={countryOptions}
                            readOnly
                            isLoading={isLoading}
                          />
                        )}
                        inputComponent={PhoneInput}
                        id={id}
                      />
                    </div>
                  </FormControl>
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
                      disabled
                      value={availableRoles.filter((role) => field.value.includes(role.value))}
                      onChange={() => {}}
                      defaultOptions={availableRoles}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={() => router.push(paths.users.root)}>
          {t("form.close", { ns: "users" })}
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

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country | undefined }[];
  isLoading?: boolean;
};

const CountrySelect = ({ value, options }: CountrySelectProps) => {
  const { t } = useTranslate(["users"]);
  return (
    <Select disabled value={value} onValueChange={() => {}}>
      <SelectTrigger className="rounded-full border-input bg-background text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <SelectValue placeholder={t("form.inputPhone.selectCountry", { ns: "users" })} />
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-64 overflow-y-auto">
        {options
          .filter((x) => x.value)
          .map((option, i) => (
            <SelectItem key={option.value ?? `empty-${i}`} value={option.value!}>
              <div className="flex items-center gap-2">
                <FlagComponent country={option.value!} countryName={option.label} />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

const PhoneInput = ({ className, ...props }: React.ComponentProps<"input">) => {
  return (
    <Input
      data-slot="phone-input"
      readOnly
      className={cn("-ms-px rounded-full shadow-none focus-visible:z-10", className)}
      {...props}
    />
  );
};
