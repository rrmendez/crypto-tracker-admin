/* eslint-disable react-hooks/rules-of-hooks */

import {
  createLimit,
  deleteLimit,
  getLimitById,
  getLimitsByClientId,
  getLimitsList,
  getSystemOperationsList,
  updateLimit,
} from "@/actions/limits";
import { CONFIG } from "@/config/global";
import { PaginationRequest } from "@/types";
import { CreateLimitDto, UpdateLimitDto } from "@/types/limit";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLimits() {
  const queryClient = useQueryClient();

  const getLimits = (params: PaginationRequest) =>
    useQuery({
      queryKey: [CONFIG.queryIds.limits, params],
      queryFn: () => getLimitsList(params),
      placeholderData: keepPreviousData,
    });

  /** **************************************
   * Get system operations
   *************************************** */
  const getSystemOperations = () =>
    useQuery({
      queryKey: [CONFIG.queryIds.systemOperations],
      queryFn: getSystemOperationsList,
      staleTime: 5 * 60 * 1000,
      placeholderData: keepPreviousData,
    });

  /** **************************************
   * Get limit
   *************************************** */
  const getLimit = (id?: string) =>
    useQuery({
      queryKey: [CONFIG.queryIds.limits, id],
      queryFn: () => getLimitById(id!),
      enabled: !!id && id.length > 0,
    });

  /** **************************************
   * Create limit
   *************************************** */
  const create = useMutation({
    mutationFn: (data: CreateLimitDto) => createLimit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONFIG.queryIds.limits],
      });
    },
  });

  /** **************************************
   * Update limit
   *************************************** */
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLimitDto }) => updateLimit(id, data),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({
        queryKey: [CONFIG.queryIds.limits],
      });
      queryClient.refetchQueries({
        queryKey: [CONFIG.queryIds.limit, id],
      });
    },
  });

  /** **************************************
   * Delete limit
   *************************************** */
  const remove = useMutation({
    mutationFn: (id: string) => deleteLimit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONFIG.queryIds.limits],
      });
    },
  });
  /** **************************************
   * Get limits by client id
   *************************************** */
  const getLimitsByClient = (clientId: string) =>
    useQuery({
      queryKey: [CONFIG.queryIds.limitsByClient, clientId],
      queryFn: () => getLimitsByClientId(clientId),
      placeholderData: keepPreviousData,
    });

  return {
    getLimits,
    getSystemOperations,
    getLimit,
    create,
    update,
    remove,
    getLimitsByClient,
  };
}
