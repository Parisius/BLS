import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  createRecovery,
  getAllRecoveries,
  getOneRecovery,
  printRecovery,
} from "./requests";
/**
 * Tag for the query to fetch all recoveries.
 */
export const ALL_RECOVERIES_QUERY_TAG = ["RECOVERIES", "ALL_RECOVERIES"];
/**
 * Tag generator for the query to fetch one recovery
 * @param recoveryId - The id of the recovery.
 * @returns The query tag.
 */
export const getOneRecoveryQueryTag = (recoveryId) => [
  "RECOVERIES",
  "ONE_RECOVERY",
  recoveryId,
];
/**
 * Tag generator for the mutation to print a recovery.
 * @param recoveryId - The id of the recovery.
 * @returns The mutation tag.
 */
export const getPrintRecoveryMutationKey = (recoveryId) => [
  "RECOVERY",
  "PRINT_RECOVERY",
  recoveryId,
];
/**
 * Tag for the mutation to create a recovery.
 */
export const CREATE_RECOVERY_MUTATION_KEY = ["RECOVERIES", "CREATE_RECOVERY"];
/**
 * Hook to invalidate all recoveries query.
 * @returns A function to invalidate the all recoveries query.
 */
export const useInvalidateAllRecoveries = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: ALL_RECOVERIES_QUERY_TAG,
    });
};
/**
 * Hook to invalidate the one recovery query.
 * @returns A function to invalidate the one recovery query.
 */
export const useInvalidateOneRecovery = () => {
  const queryClient = useQueryClient();
  return (recoveryId) =>
    queryClient.invalidateQueries({
      queryKey: getOneRecoveryQueryTag(recoveryId),
    });
};
/**
 * Hook to remove the one recovery query.
 * @returns A function to remove the one recovery query.
 */
export const useRemoveOneRecoveryQuery = () => {
  const queryClient = useQueryClient();
  return (recoveryId) =>
    queryClient.removeQueries({
      queryKey: getOneRecoveryQueryTag(recoveryId),
    });
};
/**
 * Hook to fetch all recoveries.
 * @returns The query result.
 */
export const useAllRecoveries = () =>
  useQuery({
    queryKey: ALL_RECOVERIES_QUERY_TAG,
    queryFn: () => getAllRecoveries(),
  });
/**
 * Hook to fetch one recovery.
 * @param recoveryId - The id of the recovery.
 * @returns The query result.
 */
export const useOneRecovery = (recoveryId) =>
  useQuery({
    queryKey: getOneRecoveryQueryTag(recoveryId),
    queryFn: () => getOneRecovery(recoveryId),
  });
/**
 * Hook to create a recovery.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateRecovery = (options = {}) => {
  const invalidateAllRecoveries = useInvalidateAllRecoveries();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllRecoveries();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllRecoveries]
  );
  const mutation = useMutation({
    mutationFn: (args) => createRecovery(args),
    mutationKey: CREATE_RECOVERY_MUTATION_KEY,
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
 * Hook to print a recovery.
 * @param recoveryId - The id of the recovery to print.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const usePrintRecovery = (recoveryId, options) => {
  const mutation = useMutation({
    mutationFn: () => printRecovery(recoveryId),
    mutationKey: getPrintRecoveryMutationKey(recoveryId),
    ...options,
  });
  const mutate = (mutateOptions) => mutation.mutate(undefined, mutateOptions);
  const mutateAsync = (mutateOptions) =>
    mutation.mutateAsync(undefined, mutateOptions);
  return {
    ...mutation,
    mutate,
    mutateAsync,
  };
};
