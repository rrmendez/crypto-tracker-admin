/* eslint-disable react-hooks/rules-of-hooks */
import {
  disableSecondFactor,
  getSecurityLogs,
  lockAccount,
  lockTransfers,
  unlockAccount,
  unlockTransfers,
} from "@/actions/security";
import { CONFIG } from "@/config/global";
import { PaginationRequest } from "@/types";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

export function useSecurity() {
  const getSecurityLogsClients = (id: string, params: PaginationRequest) =>
    useQuery({
      queryKey: [CONFIG.queryIds.securityLogs, id, params],
      queryFn: () => getSecurityLogs(id, params),
      placeholderData: keepPreviousData,
      enabled: !!id,
    });

  const lockAccountClients = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => lockAccount(id, reason),
  });

  const unlockAccountClients = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => unlockAccount(id, reason),
  });

  const lockTransfersClients = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => lockTransfers(id, reason),
  });

  const unlockTransfersClients = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => unlockTransfers(id, reason),
  });

  const disableSecondFactorClients = useMutation({
    mutationFn: (userId: string) => disableSecondFactor(userId),
  });

  return {
    getSecurityLogsClients,
    lockAccountClients,
    unlockAccountClients,
    lockTransfersClients,
    unlockTransfersClients,
    disableSecondFactorClients,
  };
}
