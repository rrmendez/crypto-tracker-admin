import { TabsContent } from "@/components/ui/tabs";
import ChangePasswordCard from "../security/change-password-card";
import SecondFactorCard from "../security/second-factor-card";
import PrivateKeyCard from "../security/private-key-card";

export default function SecurityTab() {
  return (
    <TabsContent value="security" className="mt-4 space-y-6">
      <ChangePasswordCard />
      <SecondFactorCard />
      <PrivateKeyCard />
    </TabsContent>
  );
}
