import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { changeTmzFromLocalToUTC } from "@/lib/utils";
import {
  completeAudit,
  createAudit,
  forwardAudit,
  getAllAudits,
  getOneAudit,
  printAudit,
  updateAudit,
} from "./requests";
/**
 * Tag for the query to fetch all audits
 */
export const ALL_AUDITS_QUERY_TAG = ["AUDIT", "ALL_AUDITS"];
/**
 * Tag generator for the query to fetch one audit.
 * @param auditId - The id of the audit.
 * @returns The query tag.
 */
export const getOneAuditQueryTag = (auditId) => ["AUDIT", "ONE_AUDIT", auditId];
/**
 * Tag for the create audit mutation.
 */
export const CREATE_AUDIT_MUTATION_KEY = ["AUDIT", "CREATE_AUDIT"];
/**
 * Tag generator for the query to update an audit.
 * @param auditId - The id of the audit.
 * @returns The mutation key.
 */
export const getUpdateAuditMutationKey = (auditId) => [
  "AUDIT",
  "UPDATE_AUDIT",
  auditId,
];
/**
 * Tag generator for the query to forward an audit.
 * @param auditId - The id of the audit.
 * @returns The mutation key.
 */
export const getForwardAuditMutationKey = (auditId) => [
  "AUDIT",
  "FORWARD_AUDIT",
  auditId,
];
/**
 * Tag generator for the query to complete an audit.
 * @param auditId - The id of the audit.
 * @returns The mutation key.
 */
export const getCompleteAuditMutationKey = (auditId) => [
  "AUDIT",
  "COMPLETE_AUDIT",
  auditId,
];
/**
 * Tag generator for the mutation to print an audit.
 * @param auditId - The id of the audit.
 * @returns The mutation tag.
 */
export const getPrintAuditMutationKey = (auditId) => [
  "AUDIT",
  "PRINT_AUDIT",
  auditId,
];
/**
 * Hook to invalidate all audits query.
 * @returns A function to invalidate all audits query.
 */
export const useInvalidateAllAudits = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: ALL_AUDITS_QUERY_TAG,
    });
};
/**
 * Hook to invalidate one audit query.
 * @returns A function to invalidate one audit query.
 */
export const useInvalidateOneAudit = () => {
  const queryClient = useQueryClient();
  return (auditId) =>
    queryClient.invalidateQueries({
      queryKey: getOneAuditQueryTag(auditId),
    });
};
/**
 * Hook to fetch all audits.
 * @returns The query result.
 */
export const useAllAudits = () =>
  useQuery({
    queryKey: ALL_AUDITS_QUERY_TAG,
    queryFn: () => getAllAudits(),
  });
/**
 * Hook to fetch one audit.
 * @param auditId - The id of the audit.
 * @returns The query result.
 */
export const useOneAudit = (auditId) =>
  useQuery({
    queryKey: getOneAuditQueryTag(auditId),
    queryFn: () => getOneAudit(auditId),
  });
/**
 * Hook to create a new audit.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateAudit = (options) => {
  const invalidateAllAudits = useInvalidateAllAudits();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllAudits();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllAudits]
  );
  const mutation = useMutation({
    mutationFn: (args) => createAudit(args),
    mutationKey: CREATE_AUDIT_MUTATION_KEY,
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
 * Hook to update an audit.
 * @param auditId - The id of the audit.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateAudit = (auditId, options) => {
  const invalidateAllAudits = useInvalidateAllAudits();
  const invalidateOneAudit = useInvalidateOneAudit();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllAudits();
        if (args[0]) await invalidateOneAudit(args[0]?.id);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllAudits, invalidateOneAudit]
  );
  const mutation = useMutation({
    mutationFn: (args) => updateAudit(auditId, args),
    mutationKey: getUpdateAuditMutationKey(auditId),
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
 * Hook to forward an audit.
 * @param auditId - The id of the audit to forward.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useForwardAudit = (auditId, options) => {
  const invalidateOneAudit = useInvalidateOneAudit();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneAudit(auditId);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [auditId, invalidateOneAudit]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      forwardAudit(auditId, {
        ...args,
        dueDate: changeTmzFromLocalToUTC(args.dueDate),
      }),
    mutationKey: getForwardAuditMutationKey(auditId),
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
 * Hook to complete an audit.
 * @param auditId - The id of the audit.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCompleteAudit = (auditId, options) => {
  const invalidateOneAudit = useInvalidateOneAudit();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneAudit(auditId);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [auditId, invalidateOneAudit]
  );
  const mutation = useMutation({
    mutationFn: (args) => completeAudit(auditId, args),
    mutationKey: getCompleteAuditMutationKey(auditId),
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
 * Hook to print an audit.
 * @param auditId - The id of the audit to print.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const usePrintAudit = (auditId, options) => {
  const mutation = useMutation({
    mutationFn: () => printAudit(auditId),
    mutationKey: getPrintAuditMutationKey(auditId),
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
