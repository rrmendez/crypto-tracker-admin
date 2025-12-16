/* eslint-disable react-hooks/rules-of-hooks */
import {
  createCurrency,
  deleteCurrency,
  enableOrDisableCurrency,
  getCurrenciesAll,
  getCurrenciesList,
  getCurrenciesPrice,
  getCurrencyById,
  getCurrencyTemplate,
  syncCurrencyPrice,
  updateCurrency,
} from "@/actions/currencies";
import { CONFIG } from "@/config/global";
import { useAuthStore } from "@/stores/authStore";
import { CreateCurrencyDto, PaginationRequest, UpdateCurrencyDto } from "@/types";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCurrencies() {
  // query client
  const queryClient = useQueryClient();

  const { isLoggedIn } = useAuthStore();

  /**
   * Get paginated currencies list
   *
   * @param params
   * @returns
   */
  const getCurrencies = (params: PaginationRequest) =>
    useQuery({
      queryKey: [CONFIG.queryIds.currencies, params],
      queryFn: () => getCurrenciesList(params),
      placeholderData: keepPreviousData,
      enabled: isLoggedIn,
    });

  /**
   * Get all currencies
   */
  const getCurrenciesSystem = () =>
    useQuery({
      queryKey: [CONFIG.queryIds.currencies],
      queryFn: () => getCurrenciesAll(),
      enabled: isLoggedIn,
    });

  /**
   * Get currency by id
   *
   * @param id
   * @returns
   */
  const getCurrency = (id?: string) =>
    useQuery({
      queryKey: [CONFIG.queryIds.currency, id],
      queryFn: () => getCurrencyById(id!),
      enabled: !!id && id.length > 0,
    });

  /**
   * Get currency template
   *
   * @returns
   */
  const getTemplate = () =>
    useQuery({
      queryKey: [CONFIG.queryIds.currencyTemplate],
      queryFn: () => getCurrencyTemplate(),
    });

  /**
   * Create currency
   *
   * @param data
   * @returns
   */
  const create = useMutation({
    mutationFn: (data: CreateCurrencyDto) => createCurrency(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONFIG.queryIds.currencies],
      });
    },
  });

  /**
   * Update currency
   *
   * @param id
   * @param data
   * @returns
   */
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCurrencyDto }) => updateCurrency(id, data),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({
        queryKey: [CONFIG.queryIds.currencies],
      });
      queryClient.refetchQueries({
        queryKey: [CONFIG.queryIds.currency, id],
      });
    },
  });

  /**
   * Enable or disable currency
   *
   * @param id
   * @param isActive
   */
  const enableOrDisable = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      enableOrDisableCurrency(id, isActive),
    onSuccess: ({ id }) => {
      toast.success("La Moneda ha sido actualizada correctamente");

      queryClient.invalidateQueries({
        queryKey: [CONFIG.queryIds.currencies],
      });
      queryClient.refetchQueries({
        queryKey: [CONFIG.queryIds.currency, id],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Ha ocurrido un error al actualizar la Moneda");
    },
  });

  /**
   * Delete currency
   *
   * @param id
   * @returns
   */
  const remove = useMutation({
    mutationFn: (id: string) => deleteCurrency(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONFIG.queryIds.currencies],
      });
    },
  });

  /**
   * Get Currencies price
   * */
  const getCurrenciesPriceQuery = (id: string) =>
    useQuery({
      queryKey: [CONFIG.queryIds.currencyPrice, id],
      queryFn: () => getCurrenciesPrice(id),
      enabled: !!id,
    });

  /**
   * Sync currency price
   */
  const syncPrice = useMutation({
    mutationFn: (id: string) => syncCurrencyPrice(id),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({
        queryKey: [CONFIG.queryIds.currencyPrice, id],
      });
      toast.success("El precio de la Moneda ha sido actualizado correctamente");
    },
    onError: (error) => {
      toast.error("Algo salió mal!", { description: error.message });
    },
  });

  return {
    create,
    update,
    remove,
    syncPrice,
    getTemplate,
    getCurrency,
    getCurrencies,
    enableOrDisable,
    getCurrenciesSystem,
    getCurrenciesPriceQuery,
  };
}
