import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { changeTmzFromLocalToUTC } from "@/lib/utils";
import {
  useInvalidateAllAdministrators,
  useInvalidateOneAdministrator,
} from "@/services/api-sdk/models/administration-meeting/administrator";
import { getOneMandate, renewMandate, updateMandate } from "./requests";
/**
 * Tag generator for the query to fetch one mandate
 * @param mandateId - The id of the mandate.
 * @returns The query tag.
 */
export const getOneMandateQueryTag = (mandateId) => [
  "MANDATES",
  "ONE_MANDATE",
  mandateId,
];
/**
 * Tag generator for the mutation to update a mandate.
 * @param mandateId - The id of the mandate to update.
 * @returns The mutation key.
 */
export const getUpdateMandateMutationKey = (mandateId) => [
  "MANDATES",
  "UPDATE_MANDATE",
  mandateId,
];
/**
 * Tag generator for the mutation to renew a mandate.
 * @param administratorId - The id of the administrator.
 * @returns The mutation key.
 */
export const getRenewMandateMutationKey = (administratorId) => [
  "MANDATES",
  "UPDATE_MANDATE",
  administratorId,
];
/**
 * Hook to invalidate the one mandate query.
 * @returns A function to invalidate the one mandate query.
 */
export const useInvalidateOneMandate = () => {
  const queryClient = useQueryClient();
  return (mandateId) =>
    queryClient.invalidateQueries({
      queryKey: getOneMandateQueryTag(mandateId),
    });
};
/**
 * Hook to fetch one mandate.
 * @param mandateId - The id of the mandate.
 * @returns The query result.
 */
export const useOneMandate = (mandateId) =>
  useQuery({
    queryKey: getOneMandateQueryTag(mandateId),
    queryFn: () => getOneMandate(mandateId),
  });
/**
 * Hook to update a mandate.
 * @param mandateId - The id of the mandate to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateMandate = (mandateId, options = {}) => {
  const invalidateOneMandate = useInvalidateOneMandate();
  const invalidateAllAdministrators = useInvalidateAllAdministrators();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneMandate(mandateId);
        await invalidateAllAdministrators();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateOneMandate, mandateId, invalidateAllAdministrators]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      updateMandate(mandateId, {
        ...args,
        startDate: changeTmzFromLocalToUTC(args.startDate),
      }),
    mutationKey: getUpdateMandateMutationKey(mandateId),
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
 * Hook to renew a mandate.
 * @param administratorId - The id of the administrator.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useRenewMandate = (administratorId, options) => {
  const invalidateOneAdministrator = useInvalidateOneAdministrator();
  const invalidateAllAdministrators = useInvalidateAllAdministrators();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneAdministrator(administratorId);
        await invalidateAllAdministrators();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateOneAdministrator, administratorId, invalidateAllAdministrators]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      renewMandate(administratorId, {
        ...args,
        startDate: changeTmzFromLocalToUTC(args.startDate),
      }),
    mutationKey: getRenewMandateMutationKey(administratorId),
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
