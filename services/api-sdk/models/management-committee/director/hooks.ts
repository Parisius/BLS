import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { changeTmzFromLocalToUTC } from "@/lib/utils";
import {
  createDirector,
  deleteDirector,
  getAllDirectors,
  getOneDirector,
  updateDirector,
} from "./requests";
export const ALL_DIRECTORS_QUERY_KEY = ["DIRECTORS", "ALL_DIRECTORS"];
/**
 * Tag generator for the query to fetch one director
 * @param directorId
 * @returns The query tag.
 */
export const getOneDirectorQueryTag = (directorId) => [
  "DIRECTORS",
  "ONE_DIRECTOR",
  directorId,
];
/**
 * Tag for the mutation to create a director.
 */
export const CREATE_DIRECTOR_MUTATION_KEY = ["DIRECTORS", "CREATE_DIRECTOR"];
/**
 * Tag generator for the mutation to update a director.
 * @param directorId - The id of the director to update.
 * @returns The mutation key.
 */
export const getUpdateDirectorMutationKey = (directorId) => [
  "DIRECTORS",
  "UPDATE_DIRECTOR",
  directorId,
];
export const getDeleteDirectorMutationKey = (directorId) => [
  "DIRECTORS",
  "DELETE_DIRECTOR",
  directorId,
];
/**
 * Hook to invalidate all directors query.
 * @returns A function to invalidate the all directors query.
 */
export const useInvalidateAllDirectors = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: ALL_DIRECTORS_QUERY_KEY,
    });
};
/**
 * Hook to invalidate the one director query.
 * @returns A function to invalidate the one director query.
 */
export const useInvalidateOneDirector = () => {
  const queryClient = useQueryClient();
  return (directorId) =>
    queryClient.invalidateQueries({
      queryKey: getOneDirectorQueryTag(directorId),
    });
};
/**
 * Hook to remove the one director query.
 * @returns A function to remove the one director query.
 */
export const useRemoveOneDirectorQuery = () => {
  const queryClient = useQueryClient();
  return (directorId) =>
    queryClient.removeQueries({
      queryKey: getOneDirectorQueryTag(directorId),
    });
};
/**
 * Hook to fetch all directors.
 * @returns The query result.
 */
export const useAllDirectors = () =>
  useQuery({
    queryKey: ALL_DIRECTORS_QUERY_KEY,
    queryFn: () => getAllDirectors(),
  });
/**
 * Hook to fetch one director.
 * @param directorId - The id of the director.
 * @returns The query result.
 */
export const useOneDirector = (directorId) =>
  useQuery({
    queryKey: getOneDirectorQueryTag(directorId),
    queryFn: () => getOneDirector(directorId),
  });
/**
 * Hook to create a director.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateDirector = (options = {}) => {
  const invalidateAllDirectors = useInvalidateAllDirectors();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllDirectors();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllDirectors]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      createDirector({
        ...args,
        birthDate: changeTmzFromLocalToUTC(args.birthDate),
        mandateStartDate: changeTmzFromLocalToUTC(args.mandateStartDate),
      }),
    mutationKey: CREATE_DIRECTOR_MUTATION_KEY,
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
 * Hook to update a director.
 * @param directorId - The id of the director to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateDirector = (directorId, options = {}) => {
  const invalidateOneDirector = useInvalidateOneDirector();
  const invalidateAllDirectors = useInvalidateAllDirectors();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneDirector(directorId);
        await invalidateAllDirectors();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [directorId, invalidateAllDirectors, invalidateOneDirector]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      updateDirector(directorId, {
        ...args,
        birthDate: args.birthDate && changeTmzFromLocalToUTC(args.birthDate),
      }),
    mutationKey: getUpdateDirectorMutationKey(directorId),
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
 * Hook to delete a director.
 * @param directorId - The id of the director to delete.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useDeleteDirector = (directorId, options = {}) => {
  const removeOneDirector = useRemoveOneDirectorQuery();
  const invalidateAllDirectors = useInvalidateAllDirectors();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        removeOneDirector(directorId);
        await invalidateAllDirectors();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [directorId, invalidateAllDirectors, removeOneDirector]
  );
  const mutation = useMutation({
    mutationFn: () => deleteDirector(directorId),
    mutationKey: getDeleteDirectorMutationKey(directorId),
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
