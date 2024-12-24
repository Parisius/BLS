import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { changeTmzFromLocalToUTC } from "@/lib/utils";
import { useInvalidateOneAccountIncident } from "@/services/api-sdk/models/account-incident/account-incident";
import {
  completeIncidentTask,
  forwardIncidentTask,
  getAllIncidentTasks,
  getOneIncidentTask,
} from "./requests";
/**
 * Tag generator for the query to fetch all incident tasks
 * @param incidentId - The id of the incident.
 * @returns The query tag.
 */
export const getAllIncidentTasksQueryTag = (incidentId) =>
  ["INCIDENT_TASKS", "ALL_INCIDENT_TASKS", incidentId].filter(Boolean);
/**
 * Tag generator for the query to fetch one incident task
 * @param taskId - The id of the incident task.
 * @returns The query tag.
 */
export const getOneIncidentTaskQueryTag = (taskId) => [
  "INCIDENT_TASKS",
  "ONE_INCIDENT_TASK",
  taskId,
];
export const getCompleteIncidentTaskMutationKey = (taskId) => [
  "INCIDENT_TASKS",
  "COMPLETE_INCIDENT_TASK",
  taskId,
];
/**
 * Tag generator for the mutation to forward an incident task.
 * @param taskId - The id of the incident task to forward.
 * @returns The mutation key
 */
export const getForwardIncidentTaskMutationKey = (taskId) => [
  "INCIDENT_TASKS",
  "FORWARD_INCIDENT_TASK",
  taskId,
];
/**
 * Hook to invalidate all incident tasks query.
 * @returns A function to invalidate the all incident tasks query.
 */
export const useInvalidateAllIncidentTasks = () => {
  const queryClient = useQueryClient();
  return (incidentId) =>
    queryClient.invalidateQueries({
      queryKey: getAllIncidentTasksQueryTag(incidentId),
    });
};
/**
 * Hook to invalidate the one incident task query.
 * @returns A function to invalidate the one incident task query.
 */
export const useInvalidateOneIncidentTask = () => {
  const queryClient = useQueryClient();
  return (taskId) =>
    queryClient.invalidateQueries({
      queryKey: getOneIncidentTaskQueryTag(taskId),
    });
};
/**
 * Hook to fetch all incident tasks.
 * @param incidentId - The id of the incident.
 * @returns The query result.
 */
export const useAllIncidentTasks = (incidentId) =>
  useQuery({
    queryKey: getAllIncidentTasksQueryTag(incidentId),
    queryFn: () => getAllIncidentTasks(incidentId),
  });
/**
 * Hook to fetch one incident task.
 * @param taskId - The id of the incident task.
 * @returns The query result.
 */
export const useOneIncidentTask = (taskId) =>
  useQuery({
    queryKey: getOneIncidentTaskQueryTag(taskId),
    queryFn: () => getOneIncidentTask(taskId),
  });
/**
 * Hook to complete an incident task.
 * @param taskId - The id of the incident task.
 * @param options - The options for the mutation.
 * @returns The mutation object.
 */
export const useCompleteIncidentTask = (taskId, options = {}) => {
  const invalidateOneIncidentTask = useInvalidateOneIncidentTask();
  const invalidateAllIncidentTasks = useInvalidateAllIncidentTasks();
  const invalidateOneAccountIncident = useInvalidateOneAccountIncident();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneIncidentTask(taskId);
        await invalidateAllIncidentTasks();
        if (args[0]?.incidentId) {
          await invalidateOneAccountIncident(args[0].incidentId);
        }
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [
      invalidateAllIncidentTasks,
      invalidateOneAccountIncident,
      invalidateOneIncidentTask,
      taskId,
    ]
  );
  const mutation = useMutation({
    mutationFn: (args) => {
      const newArgs = Object.entries(args).reduce(
        (acc, [key, value]) => {
          if (value instanceof Date) {
            return {
              ...acc,
              [key]: changeTmzFromLocalToUTC(value),
            };
          }
          if (typeof value === "string") {
            return {
              ...acc,
              [key]: value,
            };
          }
          const formData = new FormData();
          Array.from(value).forEach((file) => {
            formData.append(`${key}[files]`, file.file);
            formData.append(`${key}[names]`, file.name);
          });
          return {
            ...acc,
            [key]: formData,
          };
        },
        { type: args.type }
      );
      return completeIncidentTask(taskId, newArgs);
    },
    mutationKey: getCompleteIncidentTaskMutationKey(taskId),
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
 * Hook to forward a incident task.
 * @param taskId - The id of the incident task to forward.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useForwardIncidentTask = (taskId, options = {}) => {
  const invalidateOneIncidentTask = useInvalidateOneIncidentTask();
  const invalidateAllIncidentTasks = useInvalidateAllIncidentTasks();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneIncidentTask(taskId);
        await invalidateAllIncidentTasks();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [taskId, invalidateAllIncidentTasks, invalidateOneIncidentTask]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      forwardIncidentTask(taskId, {
        ...args,
        dueDate: changeTmzFromLocalToUTC(args.dueDate),
      }),
    mutationKey: getForwardIncidentTaskMutationKey(taskId),
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
