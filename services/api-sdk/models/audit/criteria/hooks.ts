import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  createAuditCriteria,
  deleteAuditCriteria,
  getAllAuditCriteria,
  getOneAuditCriteria,
  updateAuditCriteria,
} from "./requests";
/**
 * Tag generator for the query to fetch all contract events.
 * @param module - The module of the user.
 * @returns The query tag.
 */
export const getAllAuditCriteriaQueryTag = (module) =>
  ["EVALUATION_CRITERIA", "ALL_EVALUATION_CRITERIA", module].filter(Boolean);
/**
 * Tag generator for the query to fetch one contract event.
 * @param criteriaId - The id of the contract event.
 * @returns The query tag.
 */
export const getOneAuditCriteriaQueryTag = (criteriaId) => [
  "EVALUATION_CRITERIA",
  "ONE_EVALUATION_CRITERIA",
  criteriaId,
];
/**
 * Tag for the create audit criteria mutation.
 */
export const CREATE_EVALUATION_CRITERIA_MUTATION_KEY = [
  "EVALUATION_CRITERIA",
  "CREATE_EVALUATION_CRITERIA",
];
/**
 * Tag generator for the mutation to update an audit criteria.
 * @param criteriaId - The id of the audit criteria.
 * @returns The mutation key.
 */
export const getUpdateAuditCriteriaMutationKey = (criteriaId) => [
  "EVALUATION_CRITERIA",
  "UPDATE_EVALUATION_CRITERIA",
  criteriaId,
];
/**
 * Tag generator for the mutation to delete an audit criteria.
 * @param criteriaId - The id of the audit criteria.
 * @returns The mutation key.
 */
export const getDeleteAuditCriteriaMutationKey = (criteriaId) => [
  "EVALUATION_CRITERIA",
  "DELETE_EVALUATION_CRITERIA",
  criteriaId,
];
/**
 * Hook to invalidate all audit criteria query.
 * @returns A function to invalidate all audit criteria query.
 */
export const useInvalidateAllAuditCriteria = () => {
  const queryClient = useQueryClient();
  return (module) =>
    queryClient.invalidateQueries({
      queryKey: getAllAuditCriteriaQueryTag(module),
    });
};
/**
 * Hook to invalidate one audit criteria query.
 * @returns A function to invalidate one audit criteria query.
 */
export const useInvalidateOneAuditCriteria = () => {
  const queryClient = useQueryClient();
  return (criteriaId) =>
    queryClient.invalidateQueries({
      queryKey: getOneAuditCriteriaQueryTag(criteriaId),
    });
};
/**
 * Hook to remove one audit criteria query.
 * @returns A function to remove one audit criteria query.
 */
export const useRemoveOneAuditCriteriaQuery = () => {
  const queryClient = useQueryClient();
  return (criteriaId) =>
    queryClient.removeQueries({
      queryKey: getOneAuditCriteriaQueryTag(criteriaId),
    });
};
/**
 * Hook to fetch all audit criteria.
 * @param filters - The filters to apply to the query.
 * @returns The query result.
 */
export const useAllAuditCriteria = (filters) =>
  useQuery({
    queryKey: getAllAuditCriteriaQueryTag(filters?.module),
    queryFn: () => (filters ? getAllAuditCriteria(filters) : []),
  });
/**
 * Hook to fetch one audit criteria.
 * @param criteriaId - The id of the audit criteria.
 * @returns The query result.
 */
export const useOneAuditCriteria = (criteriaId) =>
  useQuery({
    queryKey: getOneAuditCriteriaQueryTag(criteriaId),
    queryFn: () => getOneAuditCriteria(criteriaId),
  });
/**
 * Hook to create a new audit criteria.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateAuditCriteria = (options = {}) => {
  const invalidateAllAuditCriteria = useInvalidateAllAuditCriteria();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllAuditCriteria(args[0]?.module);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllAuditCriteria]
  );
  const mutation = useMutation({
    mutationFn: (args) => createAuditCriteria(args),
    mutationKey: CREATE_EVALUATION_CRITERIA_MUTATION_KEY,
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
 * Hook to update an audit criteria.
 * @param criteriaId - The id of the audit criteria to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateAuditCriteria = (criteriaId, options = {}) => {
  const invalidateOneAuditCriteria = useInvalidateOneAuditCriteria();
  const invalidateAllAuditCriteria = useInvalidateAllAuditCriteria();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneAuditCriteria(criteriaId);
        await invalidateAllAuditCriteria(args[0]?.module);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [criteriaId, invalidateAllAuditCriteria, invalidateOneAuditCriteria]
  );
  const mutation = useMutation({
    mutationFn: (args) => updateAuditCriteria(criteriaId, args),
    mutationKey: getUpdateAuditCriteriaMutationKey(criteriaId),
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
 * Hook to delete an audit criteria.
 * @param criteriaId - The id of the audit criteria to delete.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useDeleteAuditCriteria = (criteriaId, options = {}) => {
  const removeOneAuditCriteria = useRemoveOneAuditCriteriaQuery();
  const invalidateAllAuditCriteria = useInvalidateAllAuditCriteria();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        removeOneAuditCriteria(criteriaId);
        await invalidateAllAuditCriteria();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [criteriaId, invalidateAllAuditCriteria, removeOneAuditCriteria]
  );
  const mutation = useMutation({
    mutationFn: () => deleteAuditCriteria(criteriaId),
    mutationKey: getDeleteAuditCriteriaMutationKey(criteriaId),
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
