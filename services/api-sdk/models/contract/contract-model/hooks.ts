import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  createContractModel,
  deleteContractModel,
  getAllContractModels,
} from "./requests";
/**
 * Tag generator for the query to fetch all contract models
 * @param parentId - The id of the contract model.
 * @returns The query tag.
 */
export const getAllContractModelsQueryTag = (parentId) =>
  ["CONTRACT_MODELS", "ALL_CONTRACT_MODELS", parentId].filter(Boolean);
/**
 * Tag for the mutation to create a contract model.
 */
export const CREATE_CONTRACT_MODEL_MUTATION_KEY = [
  "CONTRACT_MODELS",
  "CREATE_CONTRACT_MODEL",
];
/**
 * Tag generator for the mutation to delete a contract model.
 * @param modelId - The id of the contract model to delete.
 * @returns The mutation key.
 */
export const getDeleteContractModelMutationKey = (modelId) => [
  "CONTRACT_MODELS",
  "DELETE_CONTRACT_MODEL",
  modelId,
];
/**
 * Hook to invalidate all contract models query.
 * @returns A function to invalidate the all contract models query.
 */
export const useInvalidateAllContractModels = () => {
  const queryClient = useQueryClient();
  return (parentId) =>
    queryClient.invalidateQueries({
      queryKey: getAllContractModelsQueryTag(parentId),
    });
};
/**
 * Hook to remove all contract models query.
 * @returns A function to invalidate the all contract models query.
 */
export const useRemoveAllContractModelsQuery = () => {
  const queryClient = useQueryClient();
  return (modelId) =>
    queryClient.removeQueries({
      queryKey: getAllContractModelsQueryTag(modelId),
    });
};
/**
 * Hook to fetch all contract models.
 * @param parentId - The id of the contract model's parent.
 * @returns The query result.
 */
export const useAllContractModels = (parentId) =>
  useQuery({
    queryKey: getAllContractModelsQueryTag(parentId),
    queryFn: () => getAllContractModels(parentId),
  });
/**
 * Hook to create a contract model.
 * @param parentId - The id of the contract model category.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateContractModel = (parentId = {}, options = {}) => {
  const invalidateAllContractModels = useInvalidateAllContractModels();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllContractModels(parentId);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [parentId, invalidateAllContractModels]
  );
  const mutation = useMutation({
    mutationFn: ({ file, ...args }) => {
      let fileData;
      if (file) {
        fileData = new FormData();
        fileData.append("file", file);
      }
      return createContractModel({
        ...args,
        fileData,
      });
    },
    mutationKey: CREATE_CONTRACT_MODEL_MUTATION_KEY,
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
 * Hook to delete a contract model.
 * @param modelId - The id of the contract model to delete.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useDeleteContractModel = (modelId, options = {}) => {
  const removeContractModelsQuery = useRemoveAllContractModelsQuery();
  const invalidateAllContractModels = useInvalidateAllContractModels();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        removeContractModelsQuery(modelId);
        await invalidateAllContractModels();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllContractModels, modelId, removeContractModelsQuery]
  );
  const mutation = useMutation({
    mutationFn: () => deleteContractModel(modelId),
    mutationKey: getDeleteContractModelMutationKey(modelId),
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
