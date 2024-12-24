import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { createUser, deleteUser, getAllUsers } from "./requests";
/**
 * Tag for the query to fetch all users.
 */
export const ALL_USERS_QUERY_TAG = ["USERS", "ALL_USERS"];
/**
 * Tag for the mutation to create a user.
 */
export const CREATE_USER_MUTATION_KEY = ["USERS", "CREATE_USER"];
/**
 * Tag for the mutation to delete a user.
 * @param userId - The id of the user to delete.
 * @returns The mutation key.
 */
export const getDeleteUserMutationKey = (userId) => [
  "USERS",
  "DELETE_USER",
  userId,
];
/**
 * Hook to invalidate all users query.
 * @returns A function to invalidate the all users query.
 */
export const useInvalidateAllUsers = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: ALL_USERS_QUERY_TAG,
    });
};
/**
 * Hook to fetch all users.
 * @returns The query result.
 */
export const useAllUsers = () =>
  useQuery({
    queryKey: ALL_USERS_QUERY_TAG,
    queryFn: () => getAllUsers(),
  });
/**
 * Hook to create a user.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateUser = (options = {}) => {
  const invalidateAllUsers = useInvalidateAllUsers();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllUsers();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllUsers]
  );
  const mutation = useMutation({
    mutationFn: (args) => createUser(args),
    mutationKey: CREATE_USER_MUTATION_KEY,
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
 * Hook to delete a user
 * @param userId - The id of the user to delete.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useDeleteUser = (userId, options = {}) => {
  const invalidateAllUsers = useInvalidateAllUsers();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllUsers();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllUsers]
  );
  const mutation = useMutation({
    mutationFn: () => deleteUser(userId),
    mutationKey: getDeleteUserMutationKey(userId),
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
