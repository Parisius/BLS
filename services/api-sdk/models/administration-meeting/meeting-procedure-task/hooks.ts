import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  createMeetingProcedureTask,
  deleteMeetingProcedureTask,
  getAllMeetingProcedureTasks,
  getOneMeetingProcedureTask,
  toggleMeetingProcedureTasksStatus,
  updateMeetingProcedureTask,
  updateMeetingProcedureTaskStatus,
} from "./requests";
/**
 * Tag generator for the query to fetch all meeting procedure tasks.
 * @param meetingId
 * @returns The query tag.
 */
export const getAllMeetingProcedureTasksQueryTag = (meetingId) =>
  ["MEETING_PROCEDURE/ALL_MEETING_PROCEDURE_TASKS", meetingId].filter(Boolean);
/**
 * Tag generator for the query to fetch one meeting procedure task.
 * @param taskId
 * @returns The query tag.
 */
export const getOneMeetingProcedureTaskQueryTag = (taskId) => [
  "MEETING_PROCEDURE/ONE_MEETING_PROCEDURE_TASK",
  taskId,
];
/**
 * Tag for the mutation to create a meeting procedure task.
 */
export const CREATE_MEETING_PROCEDURE_TASK_MUTATION_KEY = [
  "MEETING_PROCEDURE/CREATE_MEETING_PROCEDURE_TASK",
];
/**
 * Tag generator for the mutation to update a meeting procedure task.
 * @param taskId - The id of the meeting task to update.
 * @returns The mutation key.
 */
export const getUpdateMeetingProcedureTaskMutationKey = (taskId) => [
  "MEETING_PROCEDURE/UPDATE_MEETING_PROCEDURE_TASK",
  taskId,
];
/**
 * Tag generator for the mutation to toggle meeting procedure tasks.
 * @returns The mutation key.
 */
export const getToggleMeetingProcedureTasksMutationKey = () => [
  "MEETING_PROCEDURE/TOGGLE_MEETING_PROCEDURE_TASKS",
];
/**
 * Hook to invalidate all meeting procedure tasks query.
 * @param meetingId - The id of the general meeting.
 * @returns A function to invalidate the all meeting procedure tasks query.
 */
export const useAllMeetingProcedureTasksInvalidate = (meetingId) => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: getAllMeetingProcedureTasksQueryTag(meetingId),
    });
};
/**
 * Hook to invalidate the one meeting procedure task query.
 * @returns A function to invalidate the one meeting procedure task query.
 */
export const useOneMeetingProcedureTaskInvalidate = () => {
  const queryClient = useQueryClient();
  return (taskId) =>
    queryClient.invalidateQueries({
      queryKey: getOneMeetingProcedureTaskQueryTag(taskId),
    });
};
/**
 * Hook to remove the one meeting procedure task query.
 * @returns A function to remove the one meeting procedure task query.
 */
export const useRemoveOneMeetingProcedureTaskQuery = () => {
  const queryClient = useQueryClient();
  return (taskId) =>
    queryClient.removeQueries({
      queryKey: getOneMeetingProcedureTaskQueryTag(taskId),
    });
};
/**
 * Hook to fetch all meeting procedure tasks.
 * @param meetingId - The id of the general meeting.
 * @returns The query result.
 */
export const useAllMeetingProcedureTasks = (meetingId) =>
  useQuery({
    queryKey: getAllMeetingProcedureTasksQueryTag(meetingId),
    queryFn: () => getAllMeetingProcedureTasks(meetingId),
  });
/**
 * Hook to fetch one meeting procedure task.
 * @param taskId - The id of the meeting task.
 * @returns The query result.
 */
export const useOneMeetingProcedureTask = (taskId) =>
  useQuery({
    queryKey: getOneMeetingProcedureTaskQueryTag(taskId),
    queryFn: () => getOneMeetingProcedureTask(taskId),
  });
/**
 * Hook to create a meeting procedure task.
 * @param meetingId - The id of the general meeting.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateMeetingProcedureTask = (meetingId, options) => {
  const invalidateAllMeetingProcedureTasks =
    useAllMeetingProcedureTasksInvalidate(meetingId);
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllMeetingProcedureTasks();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllMeetingProcedureTasks]
  );
  const mutation = useMutation({
    mutationFn: (...args) => createMeetingProcedureTask(meetingId, ...args),
    mutationKey: CREATE_MEETING_PROCEDURE_TASK_MUTATION_KEY,
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
 * Hook to update a meeting procedure task.
 * @param taskId - The id of the meeting task to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateMeetingProcedureTask = (taskId, options = {}) => {
  const invalidateOneMeetingProcedureTask =
    useOneMeetingProcedureTaskInvalidate();
  const invalidateAllMeetingProcedureTasks =
    useAllMeetingProcedureTasksInvalidate();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneMeetingProcedureTask(taskId);
        await invalidateAllMeetingProcedureTasks();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [
      invalidateOneMeetingProcedureTask,
      taskId,
      invalidateAllMeetingProcedureTasks,
    ]
  );
  const mutation = useMutation({
    mutationFn: (args) => updateMeetingProcedureTask(taskId, args),
    mutationKey: getUpdateMeetingProcedureTaskMutationKey(taskId),
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
 * Hook to update the status of a meeting procedure task.
 * @param taskId - The id of the meeting task to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateMeetingProcedureTaskStatus = (taskId, options) => {
  const invalidateAllMeetingProcedureTasks =
    useAllMeetingProcedureTasksInvalidate();
  const invalidateOneMeetingProcedureTask =
    useOneMeetingProcedureTaskInvalidate();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneMeetingProcedureTask(taskId);
        await invalidateAllMeetingProcedureTasks();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [
      invalidateAllMeetingProcedureTasks,
      invalidateOneMeetingProcedureTask,
      taskId,
    ]
  );
  const mutation = useMutation({
    mutationFn: (args) => updateMeetingProcedureTaskStatus(taskId, args),
    mutationKey: getUpdateMeetingProcedureTaskMutationKey(taskId),
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
 * Hook to toggle the status of meeting procedure tasks.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useToggleMeetingProcedureTasksStatus = (options) => {
  const invalidateAllMeetingProcedureTasks =
    useAllMeetingProcedureTasksInvalidate();
  const invalidateOneMeetingProcedureTask =
    useOneMeetingProcedureTaskInvalidate();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllMeetingProcedureTasks();
        await Promise.all(
          args[2].map(async (task) => {
            await invalidateOneMeetingProcedureTask(task.id);
          })
        );
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllMeetingProcedureTasks, invalidateOneMeetingProcedureTask]
  );
  const mutation = useMutation({
    mutationFn: (args) => toggleMeetingProcedureTasksStatus(args),
    mutationKey: getToggleMeetingProcedureTasksMutationKey(),
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
 * Hook to delete a meeting procedure task.
 * @param taskId - The id of the meeting task to delete.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useDeleteMeetingProcedureTask = (taskId, options = {}) => {
  const invalidateAllMeetingProcedureTasks =
    useAllMeetingProcedureTasksInvalidate();
  const removeOneMeetingTask = useRemoveOneMeetingProcedureTaskQuery();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllMeetingProcedureTasks();
        removeOneMeetingTask(taskId);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllMeetingProcedureTasks, removeOneMeetingTask, taskId]
  );
  const mutation = useMutation({
    mutationFn: () => deleteMeetingProcedureTask(taskId),
    mutationKey: getOneMeetingProcedureTaskQueryTag(taskId),
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
