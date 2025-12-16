/* eslint-disable react-hooks/rules-of-hooks */
import {
  activateUser,
  createUser,
  deactivateUser,
  fetchCountries,
  getUserById,
  getUsers,
  resendEmailVerification,
  sendEmailVerification,
  updateUser,
} from "@/actions/users";
import { CONFIG } from "@/config/global";
import { PaginationRequest, UserAdminDto } from "@/types";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUsers() {
  const queryClient = useQueryClient();

  const getUsersQuery = (params: PaginationRequest) =>
    useQuery({
      queryKey: [CONFIG.queryIds.users, params],
      queryFn: () => getUsers(params),
      placeholderData: keepPreviousData,
    });

  const getCountries = () =>
    useQuery({
      queryKey: [CONFIG.queryIds.countries],
      queryFn: fetchCountries,
      staleTime: CONFIG.cacheDuration,
      retry: 3,
    });

  const getUserByIdQuery = (id?: string) =>
    useQuery({
      queryKey: [CONFIG.queryIds.user, id],
      queryFn: () => getUserById(id!),
      staleTime: CONFIG.cacheDuration,
      enabled: !!id,
    });

  const create = useMutation({
    mutationFn: (data: UserAdminDto) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONFIG.queryIds.users],
      });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserAdminDto }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONFIG.queryIds.users],
      });
    },
  });

  const emailVerification = useMutation({
    mutationFn: sendEmailVerification,
  });

  const resendEmail = useMutation({
    mutationFn: (id: string) => resendEmailVerification(id),
    onSuccess: () => {
      toast.success("El correo electrónico ha sido reenviado");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Ha ocurrido un error al reenviar el correo electrónico");
    },
  });

  const deactivateUserQry = useMutation({
    mutationFn: (id: string) => deactivateUser(id),
    onSuccess: () => {
      toast.success("O usuário foi desativado");
      queryClient.invalidateQueries({
        queryKey: [CONFIG.queryIds.users],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Ocorreu um erro ao desativar o usuário");
    },
  });

  const activateUserQry = useMutation({
    mutationFn: (id: string) => activateUser(id),
    onSuccess: () => {
      toast.success("O usuário foi ativado");
      queryClient.invalidateQueries({
        queryKey: [CONFIG.queryIds.users],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Ocorreu um erro ao ativar o usuário");
    },
  });

  return {
    getUsersQuery,
    getCountries,
    getUserByIdQuery,
    deactivateUserQry,
    activateUserQry,
    resendEmail,
    emailVerification,
    create,
    update,
  };
}
