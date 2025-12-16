/* eslint-disable react-hooks/rules-of-hooks */

import { createFee, deleteFee, getFeeById, getFeesList, updateFee } from "@/actions/fees";
import { CONFIG } from "@/config/global";
import { useAuthStore } from "@/stores/authStore";
import { PaginationRequest } from "@/types";
import { UpdateFeeDto } from "@/types/fees";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useFees() {
  const queryClient = useQueryClient();

  const { isLoggedIn } = useAuthStore();

  const getFeesQuery = (params: PaginationRequest) =>
    useQuery({
      queryKey: [CONFIG.queryIds.fees, params],
      queryFn: () => getFeesList(params),
      placeholderData: keepPreviousData,
      enabled: isLoggedIn,
    });

  const getFeeByIdQuery = (id?: string) =>
    useQuery({
      queryKey: [CONFIG.queryIds.fee, id],
      queryFn: () => getFeeById(id!),
      enabled: !!id,
    });

  const create = useMutation({
    mutationFn: (data: UpdateFeeDto) => createFee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONFIG.queryIds.fees],
      });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFeeDto }) => updateFee(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: [CONFIG.queryIds.fees],
      });
      queryClient.invalidateQueries({
        queryKey: [CONFIG.queryIds.fee, id],
      });
    },
  });

  const deleteFeeQuery = useMutation({
    mutationFn: (id: string) => deleteFee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONFIG.queryIds.fees],
      });
    },
  });

  return {
    getFeesQuery,
    getFeeByIdQuery,
    create,
    update,
    deleteFeeQuery,
  };
}
