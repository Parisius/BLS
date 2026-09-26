"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllLitigation,
  getUnsuppliedLitigation,
  getOneLitigation,
  getLitigationProvisionsSummary,
  createLitigation,
  updateLitigation,
  addLitigationProvisions,
  archiveLitigation,
  assignCollaborators,
  printLitigation,
  type LitigationArgs,
  type ProvisionsArgs,
} from "./litigations";
import { getAllNatures, getAllJurisdictions, getAllLawyers } from "./reference";
import { getAllParties, createParty } from "./parties";
import {
  getAllLitigationTasks,
  createLitigationTask,
  updateLitigationTask,
  completeLitigationTask,
  forwardLitigationTask,
  deleteLitigationTask,
  type LitigationTaskArgs,
} from "./steps";
import type { ForwardWorkflowTaskArgs } from "@/lib/shared/workflow-task";

const ROOT = ["litigation"];
const LIST_KEY = [...ROOT, "list"];
const UNSUPPLIED_KEY = [...ROOT, "unsupplied"];
const STATS_KEY = [...ROOT, "stats"];
const oneKey = (litigationId: string) => [...ROOT, "one", litigationId];
const tasksKey = (litigationId: string) => [...ROOT, "tasks", litigationId];
const PARTIES_KEY = [...ROOT, "parties"];

export const useAllLitigation = () => useQuery({ queryKey: LIST_KEY, queryFn: getAllLitigation });
export const useUnsuppliedLitigation = () => useQuery({ queryKey: UNSUPPLIED_KEY, queryFn: getUnsuppliedLitigation });
export const useOneLitigation = (litigationId: string) =>
  useQuery({ queryKey: oneKey(litigationId), queryFn: () => getOneLitigation(litigationId) });
export const useLitigationProvisionsSummary = () =>
  useQuery({ queryKey: STATS_KEY, queryFn: getLitigationProvisionsSummary });

export const useAllNatures = () => useQuery({ queryKey: [...ROOT, "natures"], queryFn: getAllNatures });
export const useAllJurisdictions = () => useQuery({ queryKey: [...ROOT, "jurisdictions"], queryFn: getAllJurisdictions });
export const useAllLawyers = () => useQuery({ queryKey: [...ROOT, "lawyers"], queryFn: getAllLawyers });
export const useAllParties = () => useQuery({ queryKey: PARTIES_KEY, queryFn: getAllParties });

export const useCreateParty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createParty,
    onSettled: () => queryClient.invalidateQueries({ queryKey: PARTIES_KEY }),
  });
};

/** Anything a case's create/update/provisions/archive/tasks can change on the list, the stats or the unsupplied list. */
const invalidateCases = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: LIST_KEY });
  queryClient.invalidateQueries({ queryKey: UNSUPPLIED_KEY });
  return queryClient.invalidateQueries({ queryKey: STATS_KEY });
};

export const useCreateLitigation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: LitigationArgs) => createLitigation(args),
    onSettled: () => invalidateCases(queryClient),
  });
};

export const useUpdateLitigation = (litigationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: LitigationArgs) => updateLitigation(litigationId, args),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: oneKey(litigationId) });
      return invalidateCases(queryClient);
    },
  });
};

export const useAddLitigationProvisions = (litigationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: ProvisionsArgs) => addLitigationProvisions(litigationId, args),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: oneKey(litigationId) });
      return invalidateCases(queryClient);
    },
  });
};

export const useArchiveLitigation = (litigationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => archiveLitigation(litigationId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: oneKey(litigationId) });
      return invalidateCases(queryClient);
    },
  });
};

export const useAssignCollaborators = (litigationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { users: string[]; lawyers: string[] }) => assignCollaborators(litigationId, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: oneKey(litigationId) }),
  });
};

export const usePrintLitigation = () => useMutation({ mutationFn: printLitigation });

export const useAllLitigationTasks = (litigationId: string) =>
  useQuery({ queryKey: tasksKey(litigationId), queryFn: () => getAllLitigationTasks(litigationId) });

function invalidateCase(queryClient: ReturnType<typeof useQueryClient>, litigationId: string) {
  queryClient.invalidateQueries({ queryKey: oneKey(litigationId) });
  return queryClient.invalidateQueries({ queryKey: tasksKey(litigationId) });
}

export const useCreateLitigationTask = (litigationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: LitigationTaskArgs) => createLitigationTask(litigationId, args),
    onSettled: () => invalidateCase(queryClient, litigationId),
  });
};

export const useUpdateLitigationTask = (litigationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, args }: { taskId: string; args: LitigationTaskArgs }) => updateLitigationTask(taskId, args),
    onSettled: () => invalidateCase(queryClient, litigationId),
  });
};

export const useCompleteLitigationTask = (litigationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, formData }: { taskId: string; formData: FormData }) =>
      completeLitigationTask(litigationId, taskId, formData),
    onSettled: () => invalidateCase(queryClient, litigationId),
  });
};

export const useForwardLitigationTask = (litigationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, args }: { taskId: string; args: ForwardWorkflowTaskArgs }) =>
      forwardLitigationTask(litigationId, taskId, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: tasksKey(litigationId) }),
  });
};

export const useDeleteLitigationTask = (litigationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLitigationTask,
    onSettled: () => invalidateCase(queryClient, litigationId),
  });
};
