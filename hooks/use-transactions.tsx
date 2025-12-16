/* eslint-disable react-hooks/rules-of-hooks */
import {
  createTransfer,
  getFeeByCurrencyAndOperation,
  getNativeFeeByCurrencyAndOperation,
  getTransactionsList,
} from "@/actions/transactions";
import { CONFIG } from "@/config/global";
import { NativeGasFee, PaginationRequest } from "@/types";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";

export default function useTransactions() {
  // define query client
  const queryClient = useQueryClient();

  /**
   * Get paginated transactions list
   *
   * @param params
   * @returns
   */
  const getTransactions = (params: PaginationRequest & { walletId: string; type?: string }) =>
    useInfiniteQuery({
      queryKey: [CONFIG.queryIds.transactions, params],
      queryFn: async ({ pageParam }: { pageParam: number }) => {
        const res = await getTransactionsList({
          page: pageParam,
          limit: 10,
          walletId: params.walletId,
          type: params.type,
        });
        return res;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.data.length === 0) return undefined;

        return lastPage.page + 1;
      },
    });

  /**
   * Send transaction
   */
  const sendTransaction = useMutation({
    mutationFn: createTransfer,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [CONFIG.queryIds.wallets],
      });
      queryClient.refetchQueries({
        queryKey: [CONFIG.queryIds.transactions],
      });

      // toast.success("Transaction created successfully!");
    },
    // onError: (error) => {
    //   toast.error(error.message);
    //   toast.error("Transaction failed!");
    // },
  });

  /**
   * Get fee by currency and operation
   * @returns
   */
  const getFeeQuery = (params: { currency: string; operation: string }) =>
    useQuery({
      queryKey: [CONFIG.queryIds.fees, params],
      queryFn: async () => {
        const res = await getFeeByCurrencyAndOperation(params);
        return res;
      },
      enabled: !!params.currency && !!params.operation,
    });

  /**
   * Get native fee by currency and operation
   * @returns
   */
  const getNativeFeeQuery = (params: { currencyId: string; amount: number }) =>
    useQuery({
      queryKey: [CONFIG.queryIds.nativeGas, params],
      queryFn: async () => {
        const res = await getNativeFeeByCurrencyAndOperation(params);
        return res;
      },
      enabled: !!params.currencyId && !!params.amount,
    });

  // get gas mutation
  const getNativeGasMutation = useMutation<
    NativeGasFee,
    unknown,
    { currencyId: string; amount: number }
  >({
    mutationFn: async (params: { currencyId: string; amount: number }) => {
      return await getNativeFeeByCurrencyAndOperation(params);
    },
    onSuccess: (data, params) => {
      // Save the full response under the specific query key
      queryClient.setQueryData<NativeGasFee>([CONFIG.queryIds.nativeGas, params], data);
    },
  });

  return {
    sendTransaction,
    getTransactions,
    getFeeQuery,
    getNativeFeeQuery,
    getNativeGasMutation,
  };
}
