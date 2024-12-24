import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useInvalidateBankInfos } from "@/services/api-sdk/models/shareholding/bank-infos";
import {
  createShareholder,
  deleteShareholder,
  getAllShareholders,
  getOneShareholder,
  printSharesCertificate,
  updateShareholder,
} from "./requests";
export const ALL_SHAREHOLDERS_QUERY_KEY = ["SHAREHOLDERS", "ALL_SHAREHOLDERS"];
/**
 * Tag generator for the query to fetch one shareholder
 * @param shareholderId
 * @returns The query tag.
 */
export const getOneShareholderQueryTag = (shareholderId) => [
  "SHAREHOLDERS",
  "ONE_SHAREHOLDER",
  shareholderId,
];
/**
 * Tag for the mutation to create an shareholder.
 */
export const CREATE_SHAREHOLDER_MUTATION_KEY = [
  "SHAREHOLDERS",
  "CREATE_SHAREHOLDER",
];
/**
 * Tag generator for the mutation to print the shares certificate.
 * @param shareholderId - The id of the shareholder.
 * @returns The mutation tag.
 */
export const getPrintSharesCertificateMutationKey = (shareholderId) => [
  "SHAREHOLDERS",
  "PRINT_SHARES_CERTIFICATE",
  shareholderId,
];
/**
 * Tag generator for the mutation to update an shareholder.
 * @param shareholderId - The id of the shareholder to update.
 * @returns The mutation key.
 */
export const getUpdateShareholderMutationKey = (shareholderId) => [
  "SHAREHOLDERS",
  "UPDATE_SHAREHOLDER",
  shareholderId,
];
export const getDeleteShareholderMutationKey = (shareholderId) => [
  "SHAREHOLDERS",
  "DELETE_SHAREHOLDER",
  shareholderId,
];
/**
 * Hook to invalidate all shareholders query.
 * @returns A function to invalidate the all shareholders query.
 */
export const useInvalidateAllShareholders = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: ALL_SHAREHOLDERS_QUERY_KEY,
    });
};
/**
 * Hook to invalidate the one shareholder query.
 * @returns A function to invalidate the one shareholder query.
 */
export const useInvalidateOneShareholder = () => {
  const queryClient = useQueryClient();
  return (shareholderId) =>
    queryClient.invalidateQueries({
      queryKey: getOneShareholderQueryTag(shareholderId),
    });
};
/**
 * Hook to remove the one shareholder query.
 * @returns A function to remove the one shareholder query.
 */
export const useRemoveOneShareholderQuery = () => {
  const queryClient = useQueryClient();
  return (shareholderId) =>
    queryClient.removeQueries({
      queryKey: getOneShareholderQueryTag(shareholderId),
    });
};
/**
 * Hook to fetch all shareholders.
 * @returns The query result.
 */
export const useAllShareholders = () =>
  useQuery({
    queryKey: ALL_SHAREHOLDERS_QUERY_KEY,
    queryFn: () => getAllShareholders(),
  });
/**
 * Hook to fetch one shareholder.
 * @param shareholderId - The id of the shareholder.
 * @returns The query result.
 */
export const useOneShareholder = (shareholderId) =>
  useQuery({
    queryKey: getOneShareholderQueryTag(shareholderId),
    queryFn: () => getOneShareholder(shareholderId),
  });
/**
 * Hook to create an shareholder.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateShareholder = (options = {}) => {
  const invalidateAllShareholders = useInvalidateAllShareholders();
  const invalidateBankInfos = useInvalidateBankInfos();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllShareholders();
        await invalidateBankInfos();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllShareholders, invalidateBankInfos]
  );
  const mutation = useMutation({
    mutationFn: (args) => createShareholder(args),
    mutationKey: CREATE_SHAREHOLDER_MUTATION_KEY,
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
 * Hook to update an shareholder.
 * @param shareholderId - The id of the shareholder to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateShareholder = (shareholderId, options) => {
  const invalidateOneShareholder = useInvalidateOneShareholder();
  const invalidateAllShareholders = useInvalidateAllShareholders();
  const invalidateBankInfos = useInvalidateBankInfos();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneShareholder(shareholderId);
        await invalidateAllShareholders();
        await invalidateBankInfos();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [
      invalidateOneShareholder,
      shareholderId,
      invalidateAllShareholders,
      invalidateBankInfos,
    ]
  );
  const mutation = useMutation({
    mutationFn: (args) => updateShareholder(shareholderId, args),
    mutationKey: getUpdateShareholderMutationKey(shareholderId),
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
 * Hook to print the shares certificate.
 * @param shareholderId - The id of the shareholder.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const usePrintSharesCertificate = (shareholderId, options) => {
  const mutation = useMutation({
    mutationFn: () => printSharesCertificate(shareholderId),
    mutationKey: getPrintSharesCertificateMutationKey(shareholderId),
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
/**
 * Hook to delete an shareholder.
 * @param shareholderId - The id of the shareholder to delete.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useDeleteShareholder = (shareholderId, options = {}) => {
  const removeOneShareholder = useRemoveOneShareholderQuery();
  const invalidateAllShareholders = useInvalidateAllShareholders();
  const invalidateBankInfos = useInvalidateBankInfos();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        removeOneShareholder(shareholderId);
        await invalidateAllShareholders();
        await invalidateBankInfos();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [
      removeOneShareholder,
      shareholderId,
      invalidateAllShareholders,
      invalidateBankInfos,
    ]
  );
  const mutation = useMutation({
    mutationFn: () => deleteShareholder(shareholderId),
    mutationKey: getDeleteShareholderMutationKey(shareholderId),
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
