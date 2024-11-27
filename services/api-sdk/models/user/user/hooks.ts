import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { signIn } from "next-auth/react";
import { getAllUsers, getCurrentUser } from "./requests";
/**
 * Tag for the query to fetch all users.
 */
export const ALL_USERS_QUERY_TAG = ["USERS", "ALL_USERS"];
/**
 * Tag for the query to fetch the current user.
 */
export const CURRENT_USER_QUERY_TAG = ["USERS", "CURRENT_USER"];
/**
 * Tag for the mutation to login.
 */
export const LOGIN_MUTATION_KEY = ["USERS", "LOGIN"];
/**
 * Hook to invalidate the current user query.
 * @returns A function to invalidate the current user query.
 */
export const useInvalidateCurrentUser = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: CURRENT_USER_QUERY_TAG,
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
 * Hook to fetch the current user.
 * @returns The query result.
 */
export const useCurrentUser = () =>
  useQuery({
    queryKey: CURRENT_USER_QUERY_TAG,
    queryFn: () => getCurrentUser(),
  });
/**
 * Hook to log in.
 * @param options - The login options.
 * @returns The mutation result.
 */
export const useLogin = (options) => {
  const invalidateCurrentUser = useInvalidateCurrentUser();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateCurrentUser();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateCurrentUser]
  );
  const mutation = useMutation({
    mutationFn: async (args) => {
      const response = await signIn("credentials", {
        username: args.username,
        password: args.password,
        redirect: false,
      });
      console.log(response);

      if (!response?.ok) {
        throw new Error("Invalid credentials");
      }
    },
    mutationKey: LOGIN_MUTATION_KEY,
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
