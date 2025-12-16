import { Button } from "@/components/ui/button";
import { useTranslate } from "@/locales";

export default function Success({
  onClose,
  description = "editPhoneDialog.description",
  ns = "profile",
}: {
  onClose: () => void;
  description?: string;
  ns?: string;
}) {
  const { t } = useTranslate(["profile", "dashboard"]);
  return (
    <>
      <div className="grid gap-6 mb-14 text-center place-items-center">
        <p className="text-lg">{t(description, { ns: ns })}</p>
      </div>
      <div className="fixed bottom-0 left-0 w-full  p-4 flex justify-end gap-2">
        <Button onClick={onClose}>{t("success.end", { ns: ns })}</Button>
      </div>
    </>
  );
}
