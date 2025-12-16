"use client";

// import ErrorGeneric from "@/modules/errors/generic-error";
// import { useAuthContext } from "../hooks";

// ----------------------------------------------------------------------

export type RolesGuardProps = {
  children: React.ReactNode;
};

export function RolesGuard({ children }: RolesGuardProps) {
  // const { isAnonymous } = useAuthContext();
  // if (isAnonymous) {
  //   return <ErrorGeneric error="Unauthorized" />;
  // }
  return <>{children}</>;
}
