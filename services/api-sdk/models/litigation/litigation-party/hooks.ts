import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { createLitigationParty, getAllLitigationParties } from "./requests";
/**
 * Tag for the query to fetch all litigation parties.
 */
export const ALL_LITIGATION_PARTIES_QUERY_TAG = [
  "LITIGATION_PARTIES",
  "ALL_LITIGATION_PARTIES",
];
/**
 * Tag for the mutation to create a contract event.
 */
export const CREATE_LITIGATION_PARTY_MUTATION_KEY = [
  "LITIGATION_PARTIES",
  "CREATE_LITIGATION_PARTY",
];
/**
 * Hook to invalidate all contract events query.
 * @returns A function to invalidate the all contract events query.
 */
export const useInvalidateAllLitigationParties = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: ALL_LITIGATION_PARTIES_QUERY_TAG,
    });
};
/**
 * Hook to fetch all contract events.
 * @returns The query result.
 */
export const useAllLitigationParties = () =>
  useQuery({
    queryKey: ALL_LITIGATION_PARTIES_QUERY_TAG,
    queryFn: () => getAllLitigationParties(),
  });
/**
 * Hook to create a contract event.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateLitigationParty = (options = {}) => {
  const invalidateAllLitigationParties = useInvalidateAllLitigationParties();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllLitigationParties();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllLitigationParties]
  );
  const mutation = useMutation({
    mutationFn: (args) => createLitigationParty(args),
    mutationKey: CREATE_LITIGATION_PARTY_MUTATION_KEY,
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
