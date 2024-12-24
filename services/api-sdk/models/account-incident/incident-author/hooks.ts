import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  createIncidentAuthor,
  deleteIncidentAuthor,
  getAllIncidentAuthors,
  getOneIncidentAuthor,
  updateIncidentAuthor,
} from "./requests";
/**
 * Tag for the query to fetch all incident authors.
 */
export const ALL_INCIDENT_AUTHORS_QUERY_TAG = [
  "INCIDENT_AUTHORS",
  "ALL_INCIDENT_AUTHORS",
];
/**
 * Tag generator for the query to fetch one incident author
 * @param authorId - The id of the incident author.
 * @returns The query tag.
 */
export const getOneIncidentAuthorQueryTag = (authorId) => [
  "INCIDENT_AUTHORS",
  "ONE_INCIDENT_AUTHOR",
  authorId,
];
/**
 * Tag for the mutation to create a incident author.
 */
export const CREATE_INCIDENT_AUTHOR_MUTATION_KEY = [
  "INCIDENT_AUTHORS",
  "CREATE_INCIDENT_AUTHOR",
];
/**
 * Tag generator for the mutation to update a incident author.
 * @param authorId - The id of the incident author to update.
 * @returns The mutation key.
 */
export const getUpdateIncidentAuthorMutationKey = (authorId) => [
  "INCIDENT_AUTHORS",
  "UPDATE_INCIDENT_AUTHOR",
  authorId,
];
export const getDeleteIncidentAuthorMutationKey = (authorId) => [
  "INCIDENT_AUTHORS",
  "DELETE_INCIDENT_AUTHOR",
  authorId,
];
/**
 * Hook to invalidate all incident authors query.
 * @returns A function to invalidate the all incident authors query.
 */
export const useInvalidateAllIncidentAuthors = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: ALL_INCIDENT_AUTHORS_QUERY_TAG,
    });
};
/**
 * Hook to invalidate the one incident author query.
 * @returns A function to invalidate the one incident author query.
 */
export const useInvalidateOneIncidentAuthor = () => {
  const queryClient = useQueryClient();
  return (authorId) =>
    queryClient.invalidateQueries({
      queryKey: getOneIncidentAuthorQueryTag(authorId),
    });
};
/**
 * Hook to remove the one incident author query.
 * @returns A function to remove the one incident author query.
 */
export const useRemoveOneIncidentAuthorQuery = () => {
  const queryClient = useQueryClient();
  return (authorId) =>
    queryClient.removeQueries({
      queryKey: getOneIncidentAuthorQueryTag(authorId),
    });
};
/**
 * Hook to fetch all incident authors.
 * @returns The query result.
 */
export const useAllIncidentAuthors = () =>
  useQuery({
    queryKey: ALL_INCIDENT_AUTHORS_QUERY_TAG,
    queryFn: () => getAllIncidentAuthors(),
  });
/**
 * Hook to fetch one incident author.
 * @param authorId - The id of the incident author.
 * @returns The query result.
 */
export const useOneIncidentAuthor = (authorId) =>
  useQuery({
    queryKey: getOneIncidentAuthorQueryTag(authorId),
    queryFn: () => getOneIncidentAuthor(authorId),
  });
/**
 * Hook to create a incident author.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateIncidentAuthor = (options = {}) => {
  const invalidateAllIncidentAuthors = useInvalidateAllIncidentAuthors();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllIncidentAuthors();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllIncidentAuthors]
  );
  const mutation = useMutation({
    mutationFn: (args) => createIncidentAuthor(args),
    mutationKey: CREATE_INCIDENT_AUTHOR_MUTATION_KEY,
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
 * Hook to update a incident author.
 * @param authorId - The id of the incident author to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateIncidentAuthor = (authorId, options) => {
  const invalidateOneIncidentAuthor = useInvalidateOneIncidentAuthor();
  const invalidateAllIncidentAuthors = useInvalidateAllIncidentAuthors();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneIncidentAuthor(authorId);
        await invalidateAllIncidentAuthors();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [authorId, invalidateAllIncidentAuthors, invalidateOneIncidentAuthor]
  );
  const mutation = useMutation({
    mutationFn: (args) => updateIncidentAuthor(authorId, args),
    mutationKey: getUpdateIncidentAuthorMutationKey(authorId),
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
 * Hook to delete a incident author.
 * @param authorId - The id of the incident author to delete.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useDeleteIncidentAuthor = (authorId, options) => {
  const removeOneIncidentAuthor = useRemoveOneIncidentAuthorQuery();
  const invalidateAllIncidentAuthors = useInvalidateAllIncidentAuthors();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        removeOneIncidentAuthor(authorId);
        await invalidateAllIncidentAuthors();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [authorId, invalidateAllIncidentAuthors, removeOneIncidentAuthor]
  );
  const mutation = useMutation({
    mutationFn: () => deleteIncidentAuthor(authorId),
    mutationKey: getDeleteIncidentAuthorMutationKey(authorId),
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
