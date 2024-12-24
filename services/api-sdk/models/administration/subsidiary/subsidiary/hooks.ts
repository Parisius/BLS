import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { createSubsidiary, getAllSubsidiaries } from "./requests";
/**
 * Tag for the query to fetch all subsidiaries.
 */
export const ALL_SUBSIDIARIES_QUERY_TAG = ["SUBSIDIARIES", "ALL_SUBSIDIARIES"];
/**
 * Tag for the mutation to create a subsidiary.
 */
export const CREATE_SUBSIDIARY_MUTATION_KEY = [
  "SUBSIDIARIES",
  "CREATE_SUBSIDIARY",
];
/**
 * Hook to invalidate all subsidiaries query.
 * @returns A function to invalidate the all subsidiaries query.
 */
export const useInvalidateAllSubsidiaries = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: ALL_SUBSIDIARIES_QUERY_TAG,
    });
};
/**
 * Hook to fetch all subsidiaries.
 * @returns The query result.
 */
export const useAllSubsidiaries = () =>
  useQuery({
    queryKey: ALL_SUBSIDIARIES_QUERY_TAG,
    queryFn: () => getAllSubsidiaries(),
  });
/**
 * Hook to create a subsidiary.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateSubsidiary = (options = {}) => {
  const invalidateAllSubsidiaries = useInvalidateAllSubsidiaries();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllSubsidiaries();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllSubsidiaries]
  );
  const mutation = useMutation({
    mutationFn: (args) => createSubsidiary(args),
    mutationKey: CREATE_SUBSIDIARY_MUTATION_KEY,
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
