/* eslint-disable react-hooks/rules-of-hooks */
import {
  approveKycClient,
  getKycsByClient,
  getKycsList,
  kycsDetails,
  partiallyRejectKycClient,
  rejectKycClient,
} from "@/actions/kycs";
import { PaginationRequest } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useKycs = () => {
  const getKycsClient = (params: PaginationRequest, clientId: string) =>
    useQuery({
      queryKey: ["kycs-by-client", clientId],
      queryFn: () => getKycsByClient(params, clientId),
    });

  const getKycsDetails = (id: string) =>
    useQuery({
      queryKey: ["kycs-details", id],
      queryFn: () => kycsDetails(id),
    });

  const approveKyc = useMutation({
    mutationFn: (id: string) => approveKycClient(id),
  });

  const rejectKyc = useMutation({
    mutationFn: ({ id, rejectReason }: { id: string; rejectReason: string }) =>
      rejectKycClient(id, rejectReason),
  });

  const rejectKycPartially = useMutation({
    mutationFn: ({
      id,
      documentIds,
      rejectReason,
    }: {
      id: string;
      documentIds: string[];
      rejectReason: string;
    }) => partiallyRejectKycClient(id, documentIds, rejectReason),
  });

  const getKycsListQuery = (params: PaginationRequest) =>
    useQuery({
      queryKey: ["kycs-list", params],
      queryFn: () => getKycsList(params),
    });

  return {
    getKycsClient,
    getKycsDetails,
    getKycsListQuery,
    rejectKycPartially,
    approveKyc,
    rejectKyc,
  };
};
