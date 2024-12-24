import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { createRole, getAllRoles } from "./requests";
/**
 * Tag for the query to fetch all roles.
 */
export const ALL_ROLES_QUERY_TAG = ["ROLES", "ALL_ROLES"];
/**
 * Tag for the mutation to create a role.
 */
export const CREATE_ROLE_MUTATION_KEY = ["ROLES", "CREATE_ROLE"];
/**
 * Hook to invalidate all roles query.
 * @returns A function to invalidate the all roles query.
 */
export const useInvalidateAllRoles = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: ALL_ROLES_QUERY_TAG,
    });
};
/**
 * Hook to fetch all roles.
 * @returns The query result.
 */
export const useAllRoles = () =>
  useQuery({
    queryKey: ALL_ROLES_QUERY_TAG,
    queryFn: () => getAllRoles(),
  });
/**
 * Hook to create a role.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateRole = (options = {}) => {
  const invalidateAllRoles = useInvalidateAllRoles();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllRoles();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllRoles]
  );
  const mutation = useMutation({
    mutationFn: (args) => createRole(args),
    mutationKey: CREATE_ROLE_MUTATION_KEY,
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
