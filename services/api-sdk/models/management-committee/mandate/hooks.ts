import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { changeTmzFromLocalToUTC } from "@/lib/utils";
import {
  useInvalidateAllDirectors,
  useInvalidateOneDirector,
} from "@/services/api-sdk/models/management-committee/director";
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
  const invalidateAllDirectors = useInvalidateAllDirectors();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneMandate(mandateId);
        await invalidateAllDirectors();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateOneMandate, mandateId, invalidateAllDirectors]
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
  const invalidateOneDirector = useInvalidateOneDirector();
  const invalidateAllDirectors = useInvalidateAllDirectors();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneDirector(administratorId);
        await invalidateAllDirectors();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateOneDirector, administratorId, invalidateAllDirectors]
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
