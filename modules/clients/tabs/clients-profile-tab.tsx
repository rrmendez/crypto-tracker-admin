import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { useTranslate } from "@/locales";
import { UsersResponseVm } from "@/types";
import { getCountryCodeFromPhone } from "@/utils/external-services";
import { fDocument } from "@/utils/format-number";
import { Loader } from "lucide-react";
import Image from "next/image";

const InfoRow = ({ label, value }: { label: string; value?: string }) => {
  const { t } = useTranslate(["clients"]);
  const isPhone = ["telefone", "teléfono", "phone"].some((keyword) =>
    label.toLowerCase().includes(keyword)
  );
  const isAddress = label.toLowerCase().includes("dirección");
  const countryCode = isPhone ? getCountryCodeFromPhone(value) : null;

  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={label.toLowerCase().replace(/\s/g, "-")}>{t(label, { ns: "clients" })}</Label>
      <div className="flex items-start gap-2">
        <div className="relative w-full">
          {isAddress ? (
            <>
              <p className="block sm:hidden w-full bg-input border border-input rounded-md px-3 py-2 text-sm whitespace-pre-wrap break-words">
                {value || "No especificado"}
              </p>

              <div className="hidden sm:block relative w-full items-center">
                {countryCode && (
                  <div className="absolute left-3 w-5 h-5 top-3">
                    <Image
                      src={`https://flagcdn.com/w40/${countryCode}.png`}
                      alt={`Bandera ${countryCode.toUpperCase()}`}
                      width={20}
                      height={15}
                      className="rounded-sm"
                    />
                  </div>
                )}
                <Input
                  id={label.toLowerCase().replace(/\s/g, "-")}
                  value={value || "No especificado"}
                  readOnly
                  className={countryCode ? "pl-10" : ""}
                />
              </div>
            </>
          ) : (
            <div className="relative w-full flex items-center">
              {countryCode && (
                <div className="absolute left-3 w-5 h-5 top-3">
                  <Image
                    src={`https://flagcdn.com/w40/${countryCode}.png`}
                    alt={`Bandera ${countryCode.toUpperCase()}`}
                    width={20}
                    height={15}
                    className="rounded-sm"
                  />
                </div>
              )}
              <Input
                id={label.toLowerCase().replace(/\s/g, "-")}
                value={value || "No especificado"}
                readOnly
                className={countryCode ? "pl-10" : ""}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoSectionCard = ({
  title,
  items,
  children,
}: {
  title: string;
  items?: { label: string; value?: string; action?: React.ReactNode }[];
  children?: React.ReactNode;
}) => {
  const { t } = useTranslate();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(title, { ns: "clients" })}</CardTitle>
      </CardHeader>
      <CardContent>
        {children ? (
          children
        ) : (
          <div className="space-y-4">
            {items?.map((item, index) => (
              <InfoRow key={index} label={t(item.label, { ns: "clients" })} value={item.value} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

type ProfileTabProps = {
  user?: UsersResponseVm;
  isLoading: boolean;
};

export default function ClientsProfileTab({ user, isLoading }: ProfileTabProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <Loader className="w-5 h-5 text-blue-500 animate-spin" />
      </div>
    );
  }

  const isLegalEntity = user?.roles.includes("merchant");

  const infoAccount = [
    { label: "profileTab.email", value: user?.email },
    { label: "profileTab.phone", value: user?.phone },
  ];

  const generalInfo = isLegalEntity
    ? [
        { label: "profileTab.bussinessName", value: user?.information?.bussinessName },
        { label: "profileTab.fantasyName", value: user?.information?.fantasyName },
        { label: "profileTab.cnpj", value: fDocument(user?.information?.cnpj || "") },
      ]
    : [
        { label: "profileTab.name", value: user?.firstName },
        { label: "profileTab.lastName", value: user?.lastName },
        { label: "profileTab.cpf", value: fDocument(user?.information?.cpf || "") },
        { label: "profileTab.birthday", value: user?.information?.birthday },
        { label: "profileTab.motherName", value: user?.information?.motherName },
      ];

  const legalRepresentative = [
    { label: "profileTab.nameLegal", value: user?.fullName },
    { label: "profileTab.cpf", value: fDocument(user?.information?.cpf || "") },
  ];

  const fullAddress = [
    user?.address?.street,
    user?.address?.number,
    user?.address?.neighborhood,
    user?.address?.city,
    user?.address?.complement,
    user?.address?.state,
    user?.address?.country,
    user?.address?.zipCode,
  ]
    .filter(Boolean)
    .join(", ");

  const addressInfo = [{ label: "profileTab.address", value: fullAddress }];

  return (
    <TabsContent value="profile" className="mt-4">
      <Card>
        <CardContent>
          <div className="p-4 sm:p-6 space-y-6">
            <InfoSectionCard title="profileTab.profileInformation" items={[]}>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="relative w-36 h-36 rounded-md overflow-hidden ">
                  <Image
                    src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="Profile"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>

                <div className="flex-1 space-y-4 w-full">
                  {infoAccount.map((item, index) => (
                    <InfoRow key={index} label={item.label} value={item.value} />
                  ))}
                </div>
              </div>
            </InfoSectionCard>

            <InfoSectionCard title="profileTab.generalInformation" items={generalInfo} />
            {isLegalEntity && (
              <InfoSectionCard
                title="profileTab.legalRepresentativeInformation"
                items={legalRepresentative}
              />
            )}
            <InfoSectionCard title="profileTab.addressInformation" items={addressInfo} />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
