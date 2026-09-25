"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllRecoveries, getOneRecovery, createRecovery, printRecovery } from "./recoveries";
import {
  getAllRecoverySteps,
  createRecoveryStep,
  updateRecoveryStep,
  completeRecoveryStep,
  forwardRecoveryStep,
  deleteRecoveryStep,
  type RecoveryStepArgs,
} from "./steps";
import { getFormalizedGuarantees, getRecoverableContracts } from "./links";
import type { ForwardWorkflowTaskArgs } from "@/lib/shared/workflow-task";

const ROOT = ["recovery"];
const RECOVERIES_KEY = [...ROOT, "recoveries"];
const oneRecoveryKey = (recoveryId: string) => [...RECOVERIES_KEY, recoveryId];
const stepsKey = (recoveryId: string) => [...ROOT, "steps", recoveryId];

export const useAllRecoveries = () => useQuery({ queryKey: RECOVERIES_KEY, queryFn: getAllRecoveries });

export const useOneRecovery = (recoveryId: string) =>
  useQuery({ queryKey: oneRecoveryKey(recoveryId), queryFn: () => getOneRecovery(recoveryId) });

export const useCreateRecovery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRecovery,
    onSettled: () => queryClient.invalidateQueries({ queryKey: RECOVERIES_KEY }),
  });
};

export const usePrintRecovery = () => useMutation({ mutationFn: printRecovery });

export const useFormalizedGuarantees = () =>
  useQuery({ queryKey: [...ROOT, "guarantees"], queryFn: getFormalizedGuarantees });

export const useRecoverableContracts = () =>
  useQuery({ queryKey: [...ROOT, "contracts"], queryFn: getRecoverableContracts });

export const useAllRecoverySteps = (recoveryId: string) =>
  useQuery({ queryKey: stepsKey(recoveryId), queryFn: () => getAllRecoverySteps(recoveryId) });

/** Any step change can move the recovery's current/next step, so the recovery refetches too. */
function invalidateRecovery(queryClient: ReturnType<typeof useQueryClient>, recoveryId: string) {
  queryClient.invalidateQueries({ queryKey: oneRecoveryKey(recoveryId) });
  return queryClient.invalidateQueries({ queryKey: stepsKey(recoveryId) });
}

export const useCreateRecoveryStep = (recoveryId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: RecoveryStepArgs) => createRecoveryStep(recoveryId, args),
    onSettled: () => invalidateRecovery(queryClient, recoveryId),
  });
};

export const useUpdateRecoveryStep = (recoveryId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ stepId, args }: { stepId: string; args: RecoveryStepArgs }) => updateRecoveryStep(stepId, args),
    onSettled: () => invalidateRecovery(queryClient, recoveryId),
  });
};

export const useCompleteRecoveryStep = (recoveryId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ stepId, formData }: { stepId: string; formData: FormData }) => completeRecoveryStep(stepId, formData),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: RECOVERIES_KEY });
      return invalidateRecovery(queryClient, recoveryId);
    },
  });
};

export const useForwardRecoveryStep = (recoveryId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ stepId, args }: { stepId: string; args: ForwardWorkflowTaskArgs }) =>
      forwardRecoveryStep(stepId, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: stepsKey(recoveryId) }),
  });
};

export const useDeleteRecoveryStep = (recoveryId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRecoveryStep,
    onSettled: () => invalidateRecovery(queryClient, recoveryId),
  });
};
