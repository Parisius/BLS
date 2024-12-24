import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  createStakeholder,
  getAllStakeholders,
  getOneStakeholder,
} from "./requests";
/**
 * Tag for the query to fetch all stakeholders.
 */
export const STAKEHOLDERS_QUERY_KEY = ["STAKEHOLDERS", "ALL_STAKEHOLDERS"];
/**
 * Tag for the mutation to create a stakeholder.
 */
export const CREATE_STAKEHOLDER_MUTATION_KEY = [
  "STAKEHOLDERS",
  "CREATE_STAKEHOLDER",
];
/**
 * Get the query key for fetching one stakeholder.
 * @param id The stakeholder id.
 * @returns The query key.
 */
export const getOneStakeholderQueryKey = (id) => [
  "STAKEHOLDERS",
  "ONE_STAKEHOLDER",
  id,
];
/**
 * Hook to invalidate all stakeholders query.
 * @returns A function to invalidate the all stakeholders query.
 */
export const useInvalidateAllStakeholders = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: STAKEHOLDERS_QUERY_KEY,
    });
};
/**
 * Hook to fetch all stakeholders.
 * @returns The query result.
 */
export const useAllStakeholders = () =>
  useQuery({
    queryKey: STAKEHOLDERS_QUERY_KEY,
    queryFn: () => getAllStakeholders(),
  });
/**
 * Hook to fetch one stakeholder.
 * @param stakeholderId The stakeholder id.
 * @returns The query result.
 */
export const useOneStakeholder = (stakeholderId) =>
  useQuery({
    queryKey: getOneStakeholderQueryKey(stakeholderId),
    queryFn: () => getOneStakeholder(stakeholderId),
  });
/**
 * Hook to create a stakeholder.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateStakeholder = (options = {}) => {
  const invalidateAllStakeholders = useInvalidateAllStakeholders();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllStakeholders();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllStakeholders]
  );
  const mutation = useMutation({
    mutationFn: createStakeholder,
    mutationKey: CREATE_STAKEHOLDER_MUTATION_KEY,
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
