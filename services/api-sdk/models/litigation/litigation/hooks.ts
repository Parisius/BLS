import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  addLitigationProvisions,
  archiveLitigation,
  assignCollaborators,
  createLitigation,
  getAllLitigation,
  getLitigationProvisionsSummary,
  getOneLitigation,
  getUnSuppliedLitigation,
  printLitigation,
  updateLitigation,
} from "./requests";
/**
 * Tag for the query to fetch all litigation.
 */
export const ALL_LITIGATION_QUERY_TAG = ["LITIGATION", "ALL_LITIGATION"];
/**
 * Tag for the query to fetch unsupplied litigation.
 */
export const UNSUPPLIED_LITIGATION_QUERY_TAG = [
  "LITIGATION",
  "ALL_LITIGATION",
  "UNSUPPLIED_LITIGATION",
];
/**
 * Tag for the query to fetch litigation provisions summary.
 */
export const LITIGATION_PROVISIONS_SUMMARY_QUERY_TAG = [
  "LITIGATION",
  "ALL_LITIGATION",
  "LITIGATION_PROVISIONS_SUMMARY",
];
/**
 * Tag generator for the query to fetch one litigation
 * @param litigationId - The id of the litigation.
 * @returns The query tag.
 */
export const getOneLitigationQueryTag = (litigationId) => [
  "LITIGATION",
  "ONE_LITIGATION",
  litigationId,
];
/**
 * Tag generator for the mutation to print a litigation.
 * @param litigationId - The id of the litigation.
 * @returns The mutation tag.
 */
export const getPrintLitigationMutationKey = (litigationId) => [
  "LITIGATION",
  "PRINT_LITIGATION",
  litigationId,
];
/**
 * Tag for the mutation to create a litigation.
 */
export const CREATE_LITIGATION_MUTATION_KEY = [
  "LITIGATION",
  "CREATE_LITIGATION",
];
/**
 * Tag generator for the mutation to update a litigation.
 * @param litigationId - The id of the litigation.
 * @returns The mutation tag.
 */
export const getUpdateLitigationMutationKey = (litigationId) => [
  "LITIGATION",
  "UPDATE_LITIGATION",
  litigationId,
];
/**
 * Tag generator for the mutation to archive a litigation.
 * @param litigationId - The id of the litigation.
 * @returns The mutation tag.
 */
export const getArchiveLitigationMutationKey = (litigationId) => [
  "LITIGATION",
  "ARCHIVE_LITIGATION",
  litigationId,
];
/**
 * Tag generator for the mutation to assign collaborators to a litigation.
 * @param litigationId - The id of the litigation.
 * @returns The mutation tag.
 */
export const getAssignCollaboratorsMutationKey = (litigationId) => [
  "LITIGATION",
  "ASSIGN_COLLABORATORS",
  litigationId,
];
/**
 * Tag generator for the mutation to add litigation provisions.
 * @param litigationId - The id of the litigation.
 * @returns The mutation tag.
 */
export const getAddLitigationProvisionsMutationKey = (litigationId) => [
  "LITIGATION",
  "ADD_PROVISIONS",
  litigationId,
];
/**
 * Hook to invalidate all litigation query.
 * @returns A function to invalidate the all litigation query.
 */
export const useInvalidateAllLitigation = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: ALL_LITIGATION_QUERY_TAG,
    });
};
/**
 * Hook to invalidate the one litigation query.
 * @returns A function to invalidate the one litigation query.
 */
export const useInvalidateOneLitigation = () => {
  const queryClient = useQueryClient();
  return (litigationId) =>
    queryClient.invalidateQueries({
      queryKey: getOneLitigationQueryTag(litigationId),
    });
};
/**
 * Hook to fetch all litigation.
 * @returns The query result.
 */
export const useAllLitigation = () =>
  useQuery({
    queryKey: ALL_LITIGATION_QUERY_TAG,
    queryFn: () => getAllLitigation(),
  });
/**
 * Hook to fetch unsupplied litigation.
 * @returns The query result.
 */
export const useUnSuppliedLitigation = () =>
  useQuery({
    queryKey: UNSUPPLIED_LITIGATION_QUERY_TAG,
    queryFn: () => getUnSuppliedLitigation(),
  });
/**
 * Hook to fetch litigation provisions summary.
 * @returns The query result.
 */
export const useLitigationProvisionsSummary = () =>
  useQuery({
    queryKey: LITIGATION_PROVISIONS_SUMMARY_QUERY_TAG,
    queryFn: () => getLitigationProvisionsSummary(),
  });
/**
 * Hook to fetch one litigation.
 * @param litigationId - The id of the litigation.
 * @returns The query result.
 */
export const useOneLitigation = (litigationId) =>
  useQuery({
    queryKey: getOneLitigationQueryTag(litigationId),
    queryFn: () => getOneLitigation(litigationId),
  });
/**
 * Hook to create a litigation.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateLitigation = (options = {}) => {
  const invalidateAllLitigation = useInvalidateAllLitigation();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllLitigation();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllLitigation]
  );
  const mutation = useMutation({
    mutationFn: ({ files, ...args }) => {
      const filesData = new FormData();
      files?.forEach((file, index) => {
        filesData.append(`documents[${index}][file]`, file.file);
        filesData.append(`documents[${index}][name]`, file.filename);
      });
      return createLitigation({
        ...args,
        filesData,
      });
    },
    mutationKey: CREATE_LITIGATION_MUTATION_KEY,
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
 * Hook to update a litigation.
 * @param litigationId - The id of the litigation.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateLitigation = (litigationId, options = {}) => {
  const invalidateAllLitigation = useInvalidateAllLitigation();
  const invalidateOneLitigation = useInvalidateOneLitigation();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllLitigation();
        await invalidateOneLitigation(litigationId);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllLitigation, invalidateOneLitigation, litigationId]
  );
  const mutation = useMutation({
    mutationFn: ({ files, ...args }) => {
      const filesData = new FormData();
      files?.forEach((file, index) => {
        filesData.append(`documents[${index}][file]`, file.file);
        filesData.append(`documents[${index}][name]`, file.filename);
      });
      return updateLitigation(litigationId, {
        ...args,
        filesData,
      });
    },
    mutationKey: getUpdateLitigationMutationKey(litigationId),
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
 * Hook to add litigation provisions.
 * @param litigationId - The id of the litigation.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useAddLitigationProvisions = (litigationId, options) => {
  const invalidateOneLitigation = useInvalidateOneLitigation();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneLitigation(litigationId);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateOneLitigation, litigationId]
  );
  const mutation = useMutation({
    mutationFn: (args) => addLitigationProvisions(litigationId, args),
    mutationKey: getAddLitigationProvisionsMutationKey(litigationId),
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
 * Hook to archive a litigation.
 * @param litigationId - The id of the litigation.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useArchiveLitigation = (litigationId, options) => {
  const invalidateAllLitigation = useInvalidateAllLitigation();
  const invalidateOneLitigation = useInvalidateOneLitigation();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllLitigation();
        await invalidateOneLitigation(litigationId);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllLitigation, invalidateOneLitigation, litigationId]
  );
  const mutation = useMutation({
    mutationFn: () => archiveLitigation(litigationId),
    mutationKey: getArchiveLitigationMutationKey(litigationId),
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
/**
 * Hook to assign collaborators to a litigation.
 * @param litigationId - The id of the litigation.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useAssignCollaborators = (litigationId, options = {}) => {
  const invalidateOneLitigation = useInvalidateOneLitigation();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneLitigation(litigationId);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateOneLitigation, litigationId]
  );
  const mutation = useMutation({
    mutationFn: (args) => assignCollaborators(litigationId, args),
    mutationKey: getAssignCollaboratorsMutationKey(litigationId),
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
 * Hook to print a litigation.
 * @param litigationId - The id of the litigation to print.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const usePrintLitigation = (litigationId, options) => {
  const mutation = useMutation({
    mutationFn: () => printLitigation(litigationId),
    mutationKey: getPrintLitigationMutationKey(litigationId),
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
