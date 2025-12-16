import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import * as RPNInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";

import flags from "react-phone-number-input/flags";
import { useId, useState } from "react";
import { Loader2, PhoneIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslate } from "@/locales";
import { useUsers } from "@/hooks/use-users";

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country | undefined }[];
  isLoading?: boolean;
};

type InputPhoneProps = {
  currentPhone?: string;
  onNext: (newPhone: string) => void;
  onClose: () => void;
  loading?: boolean;
};

export default function InputPhone({ currentPhone, onNext, onClose, loading }: InputPhoneProps) {
  const { t } = useTranslate(["register", "profile"]);
  const { getCountries } = useUsers();
  const { data: countries = [], isLoading } = getCountries();
  const [phone, setPhone] = useState(currentPhone || "");
  const id = useId();

  const countryOptions = countries.map((country: { code: string; name: string }) => ({
    label: country.name,
    value: country.code,
  }));

  return (
    <>
      <div className="grid gap-6 mb-14 h-20">
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
            placeholder={t("inputPhone.phoneNumber", { ns: "profile" })}
            value={currentPhone}
            onChange={(newValue) => setPhone(newValue ?? "")}
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full  p-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          {t("inputPhone.cancel", { ns: "profile" })}
        </Button>
        <Button onClick={() => onNext(phone)} disabled={!isValidPhoneNumber(phone) || loading}>
          {loading ? (
            <div className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("inputPhone.sending", { ns: "profile" })}
            </div>
          ) : (
            t("inputPhone.continue", { ns: "profile" })
          )}
        </Button>
      </div>
    </>
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

const PhoneInput = ({ className, ...props }: React.ComponentProps<"input">) => {
  return (
    <Input
      data-slot="phone-input"
      className={cn("-ms-px rounded-s-none shadow-none focus-visible:z-10", className)}
      {...props}
    />
  );
};

const CountrySelect = ({ disabled, value, onChange, options, isLoading }: CountrySelectProps) => {
  const { t } = useTranslate("profile");
  return (
    <Select
      disabled={disabled || isLoading}
      value={value}
      onValueChange={(val) => onChange(val as RPNInput.Country)}
    >
      <SelectTrigger className="rounded-s-md border-input bg-background text-sm text-muted-foreground focus:ring-ring/50">
        <div className="flex items-center gap-2">
          <SelectValue
            placeholder={
              isLoading
                ? t("inputPhone.loading", { ns: "profile" })
                : t("inputPhone.selectCountry", { ns: "profile" })
            }
          />
        </div>
      </SelectTrigger>

      <SelectContent className="max-h-64 overflow-y-auto">
        {isLoading ? (
          <SelectItem value="loading" disabled>
            <span className="text-muted-foreground">
              {t("inputPhone.loading", { ns: "profile" })}
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
