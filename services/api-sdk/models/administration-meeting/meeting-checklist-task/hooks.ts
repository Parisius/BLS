import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  createMeetingChecklistTask,
  deleteMeetingChecklistTask,
  getAllMeetingChecklistTasks,
  getOneMeetingChecklistTask,
  toggleMeetingChecklistTasksStatus,
  updateMeetingChecklistTask,
  updateMeetingChecklistTaskStatus,
} from "./requests";
/**
 * Tag generator for the query to fetch all meeting checklist tasks.
 * @param meetingId
 * @returns The query tag.
 */
export const getAllMeetingChecklistTasksQueryTag = (meetingId) =>
  ["MEETING_CHECKLIST/ALL_MEETING_CHECKLIST_TASKS", meetingId].filter(Boolean);
/**
 * Tag generator for the query to fetch one meeting checklist task.
 * @param taskId
 * @returns The query tag.
 */
export const getOneMeetingChecklistTaskQueryTag = (taskId) => [
  "MEETING_CHECKLIST/ONE_MEETING_CHECKLIST_TASK",
  taskId,
];
/**
 * Tag for the mutation to create a meeting checklist task.
 */
export const CREATE_MEETING_CHECKLIST_TASK_MUTATION_KEY = [
  "MEETING_CHECKLIST/CREATE_MEETING_CHECKLIST_TASK",
];
/**
 * Tag generator for the mutation to update a meeting checklist task.
 * @param taskId - The id of the meeting task to update.
 * @returns The mutation key.
 */
export const getUpdateMeetingChecklistTaskMutationKey = (taskId) => [
  "MEETING_CHECKLIST/UPDATE_MEETING_CHECKLIST_TASK",
  taskId,
];
/**
 * Tag generator for the mutation to toggle meeting checklist tasks.
 * @returns The mutation key.
 */
export const getToggleMeetingChecklistTasksMutationKey = () => [
  "MEETING_CHECKLIST/TOGGLE_MEETING_CHECKLIST_TASKS",
];
/**
 * Hook to invalidate all meeting checklist tasks query.
 * @param meetingId - The id of the general meeting.
 * @returns A function to invalidate the all meeting checklist tasks query.
 */
export const useAllMeetingChecklistTasksInvalidate = (meetingId) => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: getAllMeetingChecklistTasksQueryTag(meetingId),
    });
};
/**
 * Hook to invalidate the one meeting checklist task query.
 * @returns A function to invalidate the one meeting checklist task query.
 */
export const useOneMeetingChecklistTaskInvalidate = () => {
  const queryClient = useQueryClient();
  return (taskId) =>
    queryClient.invalidateQueries({
      queryKey: getOneMeetingChecklistTaskQueryTag(taskId),
    });
};
/**
 * Hook to remove the one meeting checklist task query.
 * @returns A function to remove the one meeting checklist task query.
 */
export const useRemoveOneMeetingChecklistTaskQuery = () => {
  const queryClient = useQueryClient();
  return (taskId) =>
    queryClient.removeQueries({
      queryKey: getOneMeetingChecklistTaskQueryTag(taskId),
    });
};
/**
 * Hook to fetch all meeting checklist tasks.
 * @param meetingId - The id of the general meeting.
 * @returns The query result.
 */
export const useAllMeetingChecklistTasks = (meetingId) =>
  useQuery({
    queryKey: getAllMeetingChecklistTasksQueryTag(meetingId),
    queryFn: () => getAllMeetingChecklistTasks(meetingId),
  });
/**
 * Hook to fetch one meeting checklist task.
 * @param taskId - The id of the meeting task.
 * @returns The query result.
 */
export const useOneMeetingChecklistTask = (taskId) =>
  useQuery({
    queryKey: getOneMeetingChecklistTaskQueryTag(taskId),
    queryFn: () => getOneMeetingChecklistTask(taskId),
  });
/**
 * Hook to create a meeting checklist task.
 * @param meetingId - The id of the general meeting.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateMeetingChecklistTask = (meetingId, options) => {
  const invalidateAllMeetingChecklistTasks =
    useAllMeetingChecklistTasksInvalidate(meetingId);
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllMeetingChecklistTasks();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllMeetingChecklistTasks]
  );
  const mutation = useMutation({
    mutationFn: (args) => createMeetingChecklistTask(meetingId, args),
    mutationKey: CREATE_MEETING_CHECKLIST_TASK_MUTATION_KEY,
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
 * Hook to update a meeting checklist task.
 * @param taskId - The id of the meeting task to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateMeetingChecklistTask = (taskId, options = {}) => {
  const invalidateOneMeetingChecklistTask =
    useOneMeetingChecklistTaskInvalidate();
  const invalidateAllMeetingChecklistTasks =
    useAllMeetingChecklistTasksInvalidate();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneMeetingChecklistTask(taskId);
        await invalidateAllMeetingChecklistTasks();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [
      invalidateOneMeetingChecklistTask,
      taskId,
      invalidateAllMeetingChecklistTasks,
    ]
  );
  const mutation = useMutation({
    mutationFn: (args) => updateMeetingChecklistTask(taskId, args),
    mutationKey: getUpdateMeetingChecklistTaskMutationKey(taskId),
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
 * Hook to update the status of a meeting checklist task.
 * @param taskId - The id of the meeting task to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateMeetingChecklistTaskStatus = (taskId, options) => {
  const invalidateAllMeetingChecklistTasks =
    useAllMeetingChecklistTasksInvalidate();
  const invalidateOneMeetingChecklistTask =
    useOneMeetingChecklistTaskInvalidate();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneMeetingChecklistTask(taskId);
        await invalidateAllMeetingChecklistTasks();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [
      invalidateAllMeetingChecklistTasks,
      invalidateOneMeetingChecklistTask,
      taskId,
    ]
  );
  const mutation = useMutation({
    mutationFn: (args) => updateMeetingChecklistTaskStatus(taskId, args),
    mutationKey: getUpdateMeetingChecklistTaskMutationKey(taskId),
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
 * Hook to toggle the status of meeting checklist tasks.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useToggleMeetingChecklistTasksStatus = (options) => {
  const invalidateAllMeetingChecklistTasks =
    useAllMeetingChecklistTasksInvalidate();
  const invalidateOneMeetingChecklistTask =
    useOneMeetingChecklistTaskInvalidate();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllMeetingChecklistTasks();
        await Promise.all(
          args[2].map(async (task) => {
            await invalidateOneMeetingChecklistTask(task.id);
          })
        );
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllMeetingChecklistTasks, invalidateOneMeetingChecklistTask]
  );
  const mutation = useMutation({
    mutationFn: (args) => toggleMeetingChecklistTasksStatus(args),
    mutationKey: getToggleMeetingChecklistTasksMutationKey(),
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
 * Hook to delete a meeting checklist task.
 * @param taskId - The id of the meeting task to delete.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useDeleteMeetingChecklistTask = (taskId, options = {}) => {
  const invalidateAllMeetingChecklistTasks =
    useAllMeetingChecklistTasksInvalidate();
  const removeOneMeetingTask = useRemoveOneMeetingChecklistTaskQuery();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllMeetingChecklistTasks();
        removeOneMeetingTask(taskId);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllMeetingChecklistTasks, removeOneMeetingTask, taskId]
  );
  const mutation = useMutation({
    mutationFn: () => deleteMeetingChecklistTask(taskId),
    mutationKey: getOneMeetingChecklistTaskQueryTag(taskId),
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
