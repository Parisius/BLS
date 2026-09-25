"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllIncidents, getOneIncident, createIncident, printIncident } from "./incidents";
import { getAllIncidentAuthors, createIncidentAuthor } from "./authors";
import { getAllIncidentTasks, completeIncidentTask, forwardIncidentTask } from "./tasks";
import type { ForwardWorkflowTaskArgs, WorkflowTask } from "@/lib/shared/workflow-task";

const ROOT = ["accountIncident"];
const INCIDENTS_KEY = [...ROOT, "incidents"];
const oneIncidentKey = (incidentId: string) => [...INCIDENTS_KEY, incidentId];
const AUTHORS_KEY = [...ROOT, "authors"];
const tasksKey = (incidentId: string) => [...ROOT, "tasks", incidentId];

export const useAllIncidents = () => useQuery({ queryKey: INCIDENTS_KEY, queryFn: getAllIncidents });

export const useOneIncident = (incidentId: string) =>
  useQuery({ queryKey: oneIncidentKey(incidentId), queryFn: () => getOneIncident(incidentId) });

export const useCreateIncident = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createIncident,
    onSettled: () => queryClient.invalidateQueries({ queryKey: INCIDENTS_KEY }),
  });
};

export const usePrintIncident = () => useMutation({ mutationFn: printIncident });

export const useAllIncidentAuthors = () => useQuery({ queryKey: AUTHORS_KEY, queryFn: getAllIncidentAuthors });

export const useCreateIncidentAuthor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createIncidentAuthor,
    onSettled: () => queryClient.invalidateQueries({ queryKey: AUTHORS_KEY }),
  });
};

export const useAllIncidentTasks = (incidentId: string) =>
  useQuery({ queryKey: tasksKey(incidentId), queryFn: () => getAllIncidentTasks(incidentId) });

// Completing a task advances the incident's current task, so the incident (and its list card) refetch too.
export const useCompleteIncidentTask = (incidentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, formData }: { taskId: string; formData: FormData }) =>
      completeIncidentTask(taskId, formData),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: INCIDENTS_KEY });
      return queryClient.invalidateQueries({ queryKey: tasksKey(incidentId) });
    },
  });
};

export const useForwardIncidentTask = (incidentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ task, args }: { task: WorkflowTask; args: ForwardWorkflowTaskArgs }) =>
      forwardIncidentTask(task, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: tasksKey(incidentId) }),
  });
};
