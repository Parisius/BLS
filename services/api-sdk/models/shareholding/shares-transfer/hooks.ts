import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { changeTmzFromLocalToUTC } from "@/lib/utils";
import {
  approveSharesTransfer,
  getAllSharesTransfers,
  getOneSharesTransfer,
  transferShares,
} from "./requests";
export const ALL_SHARES_TRANSFERS_QUERY_KEY = [
  "SHARES_TRANSFERS",
  "ALL_SHARES_TRANSFERS",
];
/**
 * Key for the query to fetch one shares transfer.
 * @param transferId - The ID of the shares transfer to fetch.
 * @returns The query key.
 */
export const getOneSharesTransferQueryKey = (transferId) => [
  "SHARES_TRANSFERS",
  "ONE_SHARES_TRANSFER",
  transferId,
];
/**
 * Key for the mutation to approve shares transfer.
 * @param transferId - The ID of the shares transfer to approve.
 * @returns The mutation key.
 */
export const getApproveSharesTransferMutationKey = (transferId) => [
  "SHARES_TRANSFERS",
  "APPROVE_SHARES_TRANSFER",
  transferId,
];
/**
 * Tag for the mutation to transfer shares.
 */
export const TRANSFER_SHARES_MUTATION_KEY = [
  "SHARES_TRANSFERS",
  "TRANSFER_SHARES",
];
/**
 * Hook to invalidate all shares transfers query.
 * @returns A function to invalidate the all shares transfers query.
 */
export const useInvalidateAllSharesTransfers = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: ALL_SHARES_TRANSFERS_QUERY_KEY,
    });
};
/**
 * Hook to invalidate one shares transfer query.
 * @returns A function to invalidate the one shares transfer query.
 */
export const useInvalidateOneSharesTransfer = () => {
  const queryClient = useQueryClient();
  return (transferId) =>
    queryClient.invalidateQueries({
      queryKey: getOneSharesTransferQueryKey(transferId),
    });
};
/**
 * Hook to fetch all shares transfers.
 * @returns The query result.
 */
export const useAllSharesTransfers = () =>
  useQuery({
    queryKey: ALL_SHARES_TRANSFERS_QUERY_KEY,
    queryFn: () => getAllSharesTransfers(),
  });
/**
 * Hook to fetch one shares transfer.
 * @returns The query result.
 */
export const useOneSharesTransfer = (transferId) =>
  useQuery({
    queryKey: getOneSharesTransferQueryKey(transferId),
    queryFn: () => getOneSharesTransfer(transferId),
  });
/**
 * Hook to transfer shares.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useTransferShares = (options = {}) => {
  const invalidateAllSharesTransfers = useInvalidateAllSharesTransfers();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllSharesTransfers();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllSharesTransfers]
  );
  const mutation = useMutation({
    mutationFn: ({ transferDate, ...args }) =>
      transferShares({
        ...args,
        transferDate: changeTmzFromLocalToUTC(transferDate),
      }),
    mutationKey: TRANSFER_SHARES_MUTATION_KEY,
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
 * Hook to approve shares transfer
 * @param transferId - The ID of the shares transfer to approve.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useApproveSharesTransfer = (transferId, options) => {
  const invalidateAllSharesTransfers = useInvalidateAllSharesTransfers();
  const invalidateOneSharesTransfer = useInvalidateOneSharesTransfer();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllSharesTransfers();
        await invalidateOneSharesTransfer(transferId);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllSharesTransfers, invalidateOneSharesTransfer, transferId]
  );
  const mutation = useMutation({
    mutationFn: (args) => approveSharesTransfer(transferId, args),
    mutationKey: getApproveSharesTransferMutationKey(transferId),
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
