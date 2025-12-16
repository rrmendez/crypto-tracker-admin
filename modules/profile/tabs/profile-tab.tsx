import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useProfile from "@/hooks/use-profile";
import Image from "next/image";
import { useRef } from "react";
import { CameraIcon } from "lucide-react";
import { getCountryCodeFromPhone } from "@/utils/external-services";
import { useQueryClient } from "@tanstack/react-query";
import { CONFIG } from "@/config/global";
import { useTranslate } from "@/locales";

const ProfileInfoRow = ({
  label,
  value,
  action,
}: {
  label: string;
  value?: string;
  action?: React.ReactNode;
}) => {
  const isPhone = ["telefone", "teléfono", "phone"].some((keyword) =>
    label.toLowerCase().includes(keyword)
  );
  const isAddress = label.toLowerCase().includes("dirección");
  const countryCode = isPhone ? getCountryCodeFromPhone(value) : null;

  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={label.toLowerCase().replace(/\s/g, "-")}>{label}</Label>
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
        {action && action}
      </div>
    </div>
  );
};

export default function ProfileTab() {
  const { t } = useTranslate("profile");
  const { getProfile, updateAvatar } = useProfile();
  const { data: user } = getProfile();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const updateAvatarMutation = updateAvatar();
  const queryClient = useQueryClient();

  if (!user) {
    return null;
  }

  const handleProfilePictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (file) {
      updateAvatarMutation.mutate(file, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [CONFIG.queryIds.user] });
        },
        onError: (error) => {
          console.error("Error al actualizar la foto:", error);
        },
      });
    }
  };

  const infoSections = [
    {
      title: t("profileTab.profileTitle"),
      description: t("profileTab.profileDescription"),
      items: [
        { label: t("profileTab.name"), value: user.fullName },
        { label: t("profileTab.email"), value: user.email },
        {
          label: t("profileTab.phone"),
          value: user.phone,
          /* action: <EditPhoneDialog currentPhone={user.phone} />, */
        },
      ],
    },
  ];

  return (
    <TabsContent value="profile" className="mt-4">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{infoSections[0].title}</CardTitle>
            <CardDescription>{infoSections[0].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative w-36 h-36 rounded-md overflow-hidden group">
                <div
                  className={`absolute inset-0 z-10 ${updateAvatarMutation.isPending ? "cursor-not-allowed" : "cursor-pointer group-hover:opacity-70"}`}
                  onClick={!updateAvatarMutation.isPending ? handleProfilePictureClick : undefined}
                >
                  <Image
                    src={
                      user?.avatar ||
                      "https://img.favpng.com/22/14/20/computer-icons-user-profile-png-favpng-t5jjbVtARafBFMz6SeBYs6wmS.jpg"
                    }
                    alt="Profile"
                    layout="fill"
                    objectFit="cover"
                    className={`transition-opacity duration-300 ${
                      updateAvatarMutation.isPending ? "opacity-50 grayscale" : ""
                    }`}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <CameraIcon className="w-8 h-8 text-white" />
                    <span className="text-white text-xs mt-1">Actualizar foto</span>
                  </div>
                </div>

                {updateAvatarMutation.isPending && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20">
                    <svg
                      className="w-6 h-6 text-white animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 grid gap-4">
                {infoSections[0].items.map((item, itemIndex) => (
                  <ProfileInfoRow key={itemIndex} {...item} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />

        {infoSections.slice(1).map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {section.items.map((item, itemIndex) => (
                  <ProfileInfoRow key={itemIndex} {...item} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsContent>
  );
}
