import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
// eslint-disable-next-line import/no-cycle
import {
  printMortgage,
  useInvalidateAllMortgageSteps,
} from "@/services/api-sdk/models/mortgage";
import {
  createMortgage,
  getAllMortgages,
  getOneMortgage,
  startRealisation,
} from "./requests";
/**
 * Tag for the query to fetch all mortgages.
 */
export const ALL_MORTGAGES_QUERY_TAG = ["MORTGAGES", "ALL_MORTGAGES"];
/**
 * Tag generator for the query to fetch one mortgage
 * @param mortgageId - The id of the mortgage.
 * @returns The query tag.
 */
export const getOneMortgageQueryTag = (mortgageId) => [
  "MORTGAGES",
  "ONE_MORTGAGE",
  mortgageId,
];
/**
 * Tag generator for the mutation to print a mortgage.
 * @param mortgageId - The id of the mortgage.
 * @returns The mutation tag.
 */
export const getPrintMortgageMutationKey = (mortgageId) => [
  "MORTGAGE",
  "PRINT_MORTGAGE",
  mortgageId,
];
/**
 * Tag generator for the mutation to start realisation.
 * @param mortgageId - The id of the mortgage.
 * @returns The mutation tag.
 */
export const getStartRealisationMutationKey = (mortgageId) => [
  "MORTGAGES",
  "START_REALISATION",
  mortgageId,
];
/**
 * Tag for the mutation to create a mortgage.
 */
export const CREATE_MORTGAGE_MUTATION_KEY = ["MORTGAGES", "CREATE_MORTGAGE"];
/**
 * Hook to invalidate all mortgages query.
 * @returns A function to invalidate the all mortgages query.
 */
export const useInvalidateAllMortgages = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: ALL_MORTGAGES_QUERY_TAG,
    });
};
/**
 * Hook to invalidate the one mortgage query.
 * @returns A function to invalidate the one mortgage query.
 */
export const useInvalidateOneMortgage = () => {
  const queryClient = useQueryClient();
  return (mortgageId) =>
    queryClient.invalidateQueries({
      queryKey: getOneMortgageQueryTag(mortgageId),
    });
};
/**
 * Hook to remove the one mortgage query.
 * @returns A function to remove the one mortgage query.
 */
export const useRemoveOneMortgageQuery = () => {
  const queryClient = useQueryClient();
  return (mortgageId) =>
    queryClient.removeQueries({
      queryKey: getOneMortgageQueryTag(mortgageId),
    });
};
/**
 * Hook to fetch all mortgages.
 * @param queries - The queries to filter the mortgages.
 * @returns The query result.
 */
export const useAllMortgages = (queries = {}) =>
  useQuery({
    queryKey: ALL_MORTGAGES_QUERY_TAG,
    queryFn: () => getAllMortgages(queries),
  });
/**
 * Hook to fetch one mortgage.
 * @param mortgageId - The id of the mortgage.
 * @returns The query result.
 */
export const useOneMortgage = (mortgageId) =>
  useQuery({
    queryKey: getOneMortgageQueryTag(mortgageId),
    queryFn: () => getOneMortgage(mortgageId),
  });
/**
 * Hook to create a mortgage.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateMortgage = (options) => {
  const invalidateAllMortgages = useInvalidateAllMortgages();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllMortgages();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllMortgages]
  );
  const mutation = useMutation({
    mutationFn: (args) => createMortgage(args),
    mutationKey: CREATE_MORTGAGE_MUTATION_KEY,
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
 * Hook to start realisation.
 * @param mortgageId - The id of the mortgage.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useStartRealisation = (mortgageId, options) => {
  const invalidateOneMortgage = useInvalidateOneMortgage();
  const invalidateAllMortgageSteps = useInvalidateAllMortgageSteps();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneMortgage(mortgageId);
        await invalidateAllMortgageSteps(mortgageId);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateOneMortgage, mortgageId, invalidateAllMortgageSteps]
  );
  const mutation = useMutation({
    mutationFn: () => startRealisation(mortgageId),
    mutationKey: getStartRealisationMutationKey(mortgageId),
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
 * Hook to print a mortgage.
 * @param mortgageId - The id of the mortgage to print.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const usePrintMortgage = (mortgageId, options) => {
  const mutation = useMutation({
    mutationFn: () => printMortgage(mortgageId),
    mutationKey: getPrintMortgageMutationKey(mortgageId),
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
