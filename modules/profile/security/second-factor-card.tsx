import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/locales";
import DisableSecondFactorDialog from "../tabs/disable-second-factor-dialog";
import ActivateSecondFactorDialog from "../tabs/activate-second-factor-dialog";
import useProfile from "@/hooks/use-profile";
import Image from "next/image";

export default function SecondFactorCard() {
  const { t } = useTranslate(["register", "profile"]);
  const { getProfile } = useProfile();
  const { data: user } = getProfile();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("securityTab.titleF2a", { ns: "profile" })}</CardTitle>
          <CardDescription>{t("securityTab.descriptionF2a", { ns: "profile" })}</CardDescription>
        </div>

        {user?.isSecondFactorEnabled ? (
          <DisableSecondFactorDialog />
        ) : (
          <ActivateSecondFactorDialog />
        )}
      </CardHeader>

      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <a
            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={"/assets/images/Google_Play_Store_badge_EN.svg"}
              width={180}
              height={40}
              alt="Descargar en Google Play"
            />
          </a>

          <a
            href="https://apps.apple.com/app/google-authenticator/id388497605"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={"/assets/images/download-on-the-app-store.svg"}
              width={160}
              height={40}
              alt="Descargar en App Store"
            />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
