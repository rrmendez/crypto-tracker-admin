/* eslint-disable react-hooks/rules-of-hooks */
import { getClientDetails, getClientsList } from "@/actions/clients";
import { createWallets } from "@/actions/wallets";
import { CONFIG } from "@/config/global";
import { PaginationRequest } from "@/types";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useClients() {
  const getClients = (params: PaginationRequest) =>
    useQuery({
      queryKey: [CONFIG.queryIds.clients, params],
      queryFn: () => getClientsList(params),
      placeholderData: keepPreviousData,
    });

  const getDetails = (id: string) =>
    useQuery({
      queryKey: ["clients-details", id],
      queryFn: () => getClientDetails(id),
      placeholderData: keepPreviousData,
    });

  const createWalletsList = useMutation({
    mutationFn: (userId: string) => createWallets(userId),
    onSuccess: () => {
      toast.success("Se han creado las carteras correctamente");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Ha ocurrido un error al crear las carteras");
    },
  });

  return {
    getClients,
    getDetails,
    createWalletsList,
  };
}
