import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { changeTmzFromLocalToUTC } from "@/lib/utils";
import {
  createAdministrator,
  deleteAdministrator,
  getAllAdministrators,
  getOneAdministrator,
  updateAdministrator,
} from "./requests";
export const ALL_ADMINISTRATORS_QUERY_KEY = [
  "ADMINISTRATORS",
  "ALL_ADMINISTRATORS",
];
/**
 * Tag generator for the query to fetch one administrator
 * @param administratorId
 * @returns The query tag.
 */
export const getOneAdministratorQueryTag = (administratorId) => [
  "ADMINISTRATORS",
  "ONE_ADMINISTRATOR",
  administratorId,
];
/**
 * Tag for the mutation to create an administrator.
 */
export const CREATE_ADMINISTRATOR_MUTATION_KEY = [
  "ADMINISTRATORS",
  "CREATE_ADMINISTRATOR",
];
/**
 * Tag generator for the mutation to update an administrator.
 * @param administratorId - The id of the administrator to update.
 * @returns The mutation key.
 */
export const getUpdateAdministratorMutationKey = (administratorId) => [
  "ADMINISTRATORS",
  "UPDATE_ADMINISTRATOR",
  administratorId,
];
export const getDeleteAdministratorMutationKey = (administratorId) => [
  "ADMINISTRATORS",
  "DELETE_ADMINISTRATOR",
  administratorId,
];
/**
 * Hook to invalidate all administrators query.
 * @returns A function to invalidate the all administrators query.
 */
export const useInvalidateAllAdministrators = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: ALL_ADMINISTRATORS_QUERY_KEY,
    });
};
/**
 * Hook to invalidate the one administrator query.
 * @returns A function to invalidate the one administrator query.
 */
export const useInvalidateOneAdministrator = () => {
  const queryClient = useQueryClient();
  return (administratorId) =>
    queryClient.invalidateQueries({
      queryKey: getOneAdministratorQueryTag(administratorId),
    });
};
/**
 * Hook to remove the one administrator query.
 * @returns A function to remove the one administrator query.
 */
export const useRemoveOneAdministratorQuery = () => {
  const queryClient = useQueryClient();
  return (administratorId) =>
    queryClient.removeQueries({
      queryKey: getOneAdministratorQueryTag(administratorId),
    });
};
/**
 * Hook to fetch all administrators.
 * @returns The query result.
 */
export const useAllAdministrators = () =>
  useQuery({
    queryKey: ALL_ADMINISTRATORS_QUERY_KEY,
    queryFn: () => getAllAdministrators(),
  });
/**
 * Hook to fetch one administrator.
 * @param administratorId - The id of the administrator.
 * @returns The query result.
 */
export const useOneAdministrator = (administratorId) =>
  useQuery({
    queryKey: getOneAdministratorQueryTag(administratorId),
    queryFn: () => getOneAdministrator(administratorId),
  });
/**
 * Hook to create an administrator.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateAdministrator = (options = {}) => {
  const invalidateAllAdministrators = useInvalidateAllAdministrators();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllAdministrators();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllAdministrators]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      createAdministrator({
        ...args,
        birthDate: changeTmzFromLocalToUTC(args.birthDate),
        mandateStartDate: changeTmzFromLocalToUTC(args.mandateStartDate),
      }),
    mutationKey: CREATE_ADMINISTRATOR_MUTATION_KEY,
    ...getMutationOptions(options),
  });
  const mutate = (mutateArgs, mutateOptions) =>
    mutation.mutate(mutateArgs, getMutationOptions(mutateOptions));
  const mutateAsync = (mutateArgs, mutateOptions) =>
    mutation.mutateAsync(mutateArgs, getMutationOptions(mutateOptions));
  return {
    ...mutation,
    mutate,
    mutateAsync,
  };
};
/**
 * Hook to update an administrator.
 * @param administratorId - The id of the administrator to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateAdministrator = (administratorId, options = {}) => {
  const invalidateOneAdministrator = useInvalidateOneAdministrator();
  const invalidateAllAdministrators = useInvalidateAllAdministrators();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneAdministrator(administratorId);
        await invalidateAllAdministrators();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [administratorId, invalidateAllAdministrators, invalidateOneAdministrator]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      updateAdministrator(administratorId, {
        ...args,
        birthDate: args.birthDate && changeTmzFromLocalToUTC(args.birthDate),
      }),
    mutationKey: getUpdateAdministratorMutationKey(administratorId),
    ...getMutationOptions(options),
  });
  const mutate = (mutateArgs, mutateOptions) =>
    mutation.mutate(mutateArgs, getMutationOptions(mutateOptions));
  const mutateAsync = (mutateArgs, mutateOptions) =>
    mutation.mutateAsync(mutateArgs, getMutationOptions(mutateOptions));
  return {
    ...mutation,
    mutate,
    mutateAsync,
  };
};
/**
 * Hook to delete an administrator.
 * @param administratorId - The id of the administrator to delete.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useDeleteAdministrator = (administratorId, options = {}) => {
  const removeOneAdministrator = useRemoveOneAdministratorQuery();
  const invalidateAllAdministrators = useInvalidateAllAdministrators();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        removeOneAdministrator(administratorId);
        await invalidateAllAdministrators();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [administratorId, invalidateAllAdministrators, removeOneAdministrator]
  );
  const mutation = useMutation({
    mutationFn: () => deleteAdministrator(administratorId),
    mutationKey: getDeleteAdministratorMutationKey(administratorId),
    ...getMutationOptions(options),
  });
  const mutate = (mutateOptions) =>
    mutation.mutate(undefined, getMutationOptions(mutateOptions));
  const mutateAsync = (mutateOptions) =>
    mutation.mutateAsync(undefined, getMutationOptions(mutateOptions));
  return {
    ...mutation,
    mutate,
    mutateAsync,
  };
};
