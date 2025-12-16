import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import SecondFactor from "../dialogs/second-factor";
import SwitchBlockTransfer from "../dialogs/switch-block-transfer";
import SwitchBlockAccount from "../dialogs/switch-block-account";
import { UsersResponseVm } from "@/types";

import SecurityLogsTable from "../security-logs-table";
import { useTranslate } from "@/locales";

type SecurityTabProps = {
  user?: UsersResponseVm;
};

export default function ClientsSecurityTab({ user }: SecurityTabProps) {
  const { t } = useTranslate(["clients"]);

  return (
    <TabsContent value="security" className="mt-4">
      <Card>
        <CardContent>
          <div className="p-4 sm:p-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("securityTab.title", { ns: "clients" })}</CardTitle>
                <CardDescription>{t("securityTab.description", { ns: "clients" })}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <span className="text-sm">{t("securityTab.content", { ns: "clients" })}</span>
                  <div className="sm:self-end">
                    <SecondFactor user={user} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("securityTab.blockAccount", { ns: "clients" })}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <SwitchBlockAccount
                      type={user?.isBlocked ? "unblock" : "block"}
                      userId={user?.id}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("securityTab.blockTransfers", { ns: "clients" })}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <SwitchBlockTransfer
                      type={user?.withdrawBlocked ? "unblock" : "block"}
                      userId={user?.id}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t("securityTab.history", { ns: "clients" })}</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <SecurityLogsTable id={user?.id} />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
