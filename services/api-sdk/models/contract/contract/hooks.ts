import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { changeTmzFromLocalToUTC } from "@/lib/utils";
import {
  completeContract,
  createContract,
  deleteContract,
  forwardContract,
  getAllContracts,
  getOneContract,
  planContractDates,
  printContract,
  updateContract,
} from "./requests";
/**
 * Tag for the query to fetch all contracts.
 */
export const ALL_CONTRACTS_QUERY_TAG = ["CONTRACTS", "ALL_CONTRACTS"];
/**
 * Tag generator for the query to fetch one contract
 * @param contractId - The id of the contract.
 * @returns The query tag.
 */
export const getOneContractQueryTag = (contractId) => [
  "CONTRACTS",
  "ONE_CONTRACT",
  contractId,
];
/**
 * Tag generator for the mutation to forward a contract.
 * @param contractId - The id of the contract to forward.
 * @returns The mutation key
 */
export const getForwardContractMutationKey = (contractId) => [
  "CONTRACTS",
  "FORWARD_CONTRACT",
  contractId,
];
/**
 * Tag generator for the mutation to complete a contract.
 * @param contractId - The id of the contract to complete.
 * @returns The mutation key
 */
export const getCompleteContractMutationKey = (contractId) => [
  "CONTRACTS",
  "COMPLETE_CONTRACT",
  contractId,
];
/**
 * Tag generator for the mutation to print a contract.
 * @param contractId - The id of the contract.
 * @returns The mutation tag.
 */
export const getPrintContractMutationKey = (contractId) => [
  "CONTRACTS",
  "PRINT_CONTRACT",
  contractId,
];
/**
 * Tag for the mutation to create a contract.
 */
export const CREATE_CONTRACT_MUTATION_KEY = ["CONTRACTS", "CREATE_CONTRACT"];
/**
 * Tag generator for the mutation to update a contract.
 * @param contractId - The id of the contract to update.
 * @returns The mutation key.
 */
export const getUpdateContractMutationKey = (contractId) => [
  "CONTRACTS",
  "UPDATE_CONTRACT",
  contractId,
];
/**
 * Tag generator for the mutation to get the plan contract dates.
 * @param contractId - The id of the contract.
 * @returns The mutation key.
 */
export const getPlanContractDatesMutationKey = (contractId) => [
  "CONTRACTS",
  "PLAN_CONTRACT_DATES",
  contractId,
];
export const getDeleteContractMutationKey = (contractId) => [
  "CONTRACTS",
  "DELETE_CONTRACT",
  contractId,
];
/**
 * Hook to invalidate all contracts query.
 * @returns A function to invalidate the all contracts query.
 */
export const useInvalidateAllContracts = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: ALL_CONTRACTS_QUERY_TAG,
    });
};
/**
 * Hook to invalidate the one contract query.
 * @returns A function to invalidate the one contract query.
 */
export const useInvalidateOneContract = () => {
  const queryClient = useQueryClient();
  return (contractId) =>
    queryClient.invalidateQueries({
      queryKey: getOneContractQueryTag(contractId),
    });
};
/**
 * Hook to remove the one contract query.
 * @returns A function to remove the one contract query.
 */
export const useRemoveOneContractQuery = () => {
  const queryClient = useQueryClient();
  return (contractId) =>
    queryClient.removeQueries({
      queryKey: getOneContractQueryTag(contractId),
    });
};
/**
 * Hook to fetch all contracts.
 * @param queries - The queries to filter the contracts.
 * @returns The query result.
 */
export const useAllContracts = (queries = {}) =>
  useQuery({
    queryKey: ALL_CONTRACTS_QUERY_TAG,
    queryFn: () => getAllContracts(queries),
  });
/**
 * Hook to fetch one contract.
 * @param contractId - The id of the contract.
 * @returns The query result.
 */
export const useOneContract = (contractId) =>
  useQuery({
    queryKey: getOneContractQueryTag(contractId),
    queryFn: () => getOneContract(contractId),
  });
/**
 * Hook to create a contract.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateContract = (options = {}) => {
  const invalidateAllContracts = useInvalidateAllContracts();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllContracts();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllContracts]
  );
  const mutation = useMutation({
    mutationFn: ({ files, ...args }) => {
      const filesData = new FormData();
      files?.forEach((file, index) => {
        filesData.append(`contract_documents[${index}][file]`, file.file);
        filesData.append(`contract_documents[${index}][name]`, file.filename);
      });
      return createContract({
        ...args,
        filesData,
      });
    },
    mutationKey: CREATE_CONTRACT_MUTATION_KEY,
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
 * Hook to update a contract.
 * @param contractId - The id of the contract to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateContract = (contractId, options) => {
  const invalidateOneContract = useInvalidateOneContract();
  const invalidateAllContracts = useInvalidateAllContracts();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneContract(contractId);
        await invalidateAllContracts();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [contractId, invalidateAllContracts, invalidateOneContract]
  );
  const mutation = useMutation({
    mutationFn: (args) => updateContract(contractId, args),
    mutationKey: getUpdateContractMutationKey(contractId),
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
 * Hook to forward a contract.
 * @param contractId - The id of the contract to forward.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useForwardContract = (contractId, options) => {
  const invalidateOneContract = useInvalidateOneContract();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneContract(contractId);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [contractId, invalidateOneContract]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      forwardContract(contractId, {
        ...args,
        dueDate: changeTmzFromLocalToUTC(args.dueDate),
      }),
    mutationKey: getForwardContractMutationKey(contractId),
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
 * Hook to complete a contract.
 * @param contractId - The id of the contract to complete.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCompleteContract = (contractId, options = {}) => {
  const invalidateOneContract = useInvalidateOneContract();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneContract(contractId);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateOneContract, contractId]
  );
  const mutation = useMutation({
    mutationFn: ({ files, ...args }) => {
      const filesData = new FormData();
      files?.forEach((file, index) => {
        filesData.append(`contract_documents[${index}][file]`, file.file);
        filesData.append(`contract_documents[${index}][name]`, file.filename);
      });
      return completeContract(contractId, {
        ...args,
        filesData,
      });
    },
    mutationKey: getCompleteContractMutationKey(contractId),
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
 * Hook to update the contract dates.
 * @param contractId - The id of the contract to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const usePlanContractDates = (contractId, options = {}) => {
  const invalidateOneContract = useInvalidateOneContract();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneContract(contractId);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [contractId, invalidateOneContract]
  );
  const mutation = useMutation({
    mutationFn: (args) => {
      const newArgs = {
        ...args,
        signatureDate:
          args.signatureDate && changeTmzFromLocalToUTC(args.signatureDate),
        effectiveDate:
          args.effectiveDate && changeTmzFromLocalToUTC(args.effectiveDate),
        expirationDate:
          args.expirationDate && changeTmzFromLocalToUTC(args.expirationDate),
        renewalDate:
          args.renewalDate && changeTmzFromLocalToUTC(args.renewalDate),
      };
      return planContractDates(contractId, newArgs);
    },
    mutationKey: getPlanContractDatesMutationKey(contractId),
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
 * Hook to delete a contract.
 * @param contractId - The id of the contract to delete.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useDeleteContract = (contractId, options) => {
  const removeOneContract = useRemoveOneContractQuery();
  const invalidateAllContracts = useInvalidateAllContracts();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        removeOneContract(contractId);
        await invalidateAllContracts();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [contractId, invalidateAllContracts, removeOneContract]
  );
  const mutation = useMutation({
    mutationFn: () => deleteContract(contractId),
    mutationKey: getDeleteContractMutationKey(contractId),
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
 * Hook to print a contract.
 * @param contractId - The id of the contract to print.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const usePrintContract = (contractId, options) => {
  const mutation = useMutation({
    mutationFn: () => printContract(contractId),
    mutationKey: getPrintContractMutationKey(contractId),
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
