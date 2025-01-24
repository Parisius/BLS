import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { changeTmzFromLocalToUTC } from "@/lib/utils";
import { useOneAdministrationMeetingInvalidate } from "@/services/api-sdk/models/administration-meeting/administration-meeting";
import {
  createMeetingTask,
  deleteMeetingTask,
  forwardMeetingTask,
  getAllMeetingTasks,
  getOneMeetingTask,
  markMeetingTaskAsCompleted,
  updateMeetingTask,
} from "./requests";
/**
 * Tag generator for the query to fetch all meeting tasks
 * @param meetingId
 * @returns The query tag.
 */
export const getAllMeetingTasksQueryTag = (meetingId) =>
  ["MEETING_TASKS/ALL_MEETING_TASKS", meetingId].filter(Boolean);
/**
 * Tag generator for the query to fetch one meeting task
 * @param taskId
 * @returns The query tag.
 */
export const getOneMeetingTaskQueryTag = (taskId) => [
  "MEETING_TASKS/ONE_MEETING_TASK",
  taskId,
];
/**
 * Tag generator for the mutation to forward a meeting task.
 * @param taskId - The id of the meeting task to forward.
 * @returns The mutation key
 */
export const getForwardMeetingTaskMutationKey = (taskId) => [
  "MEETING_TASKS",
  "FORWARD_MEETING_TASK",
  taskId,
];
/**
 * Tag for the mutation to create a meeting task.
 */
export const CREATE_MEETING_TASK_MUTATION_KEY = [
  "MEETING_TASKS/CREATE_MEETING_TASK",
];
/**
 * Tag generator for the mutation to update a meeting task.
 * @param taskId - The id of the meeting task to update.
 * @returns The mutation key.
 */
export const getUpdateMeetingTaskMutationKey = (taskId) => [
  "MEETING_TASKS/UPDATE_MEETING_TASK",
  taskId,
];
/**
 * Tag generator for the mutation to mark a meeting task as completed.
 * @param taskId
 * @returns The mutation key.
 */
export const getMarkMeetingTaskAsCompletedMutationKey = (taskId) => [
  "MEETING_TASKS/MARK_MEETING_TASK_AS_COMPLETED",
  taskId,
];
export const getDeleteMeetingTaskMutationKey = (taskId) => [
  "MEETING_TASKS/DELETE_MEETING_TASK",
  taskId,
];
/**
 * Hook to invalidate all meeting tasks query.
 * @param meetingId - The id of the general meeting.
 * @returns A function to invalidate the all meeting tasks query.
 */
export const useInvalidateAllMeetingTasks = (meetingId) => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: getAllMeetingTasksQueryTag(meetingId),
    });
};
/**
 * Hook to invalidate the one meeting task query.
 * @returns A function to invalidate the one meeting task query.
 */
export const useInvalidateOneMeetingTask = () => {
  const queryClient = useQueryClient();
  return (taskId) =>
    queryClient.invalidateQueries({
      queryKey: getOneMeetingTaskQueryTag(taskId),
    });
};
/**
 * Hook to remove the one meeting task query.
 * @param taskId - The id of the meeting task.
 * @returns A function to remove the one meeting task query.
 */
export const useRemoveOneMeetingTaskQuery = (taskId) => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.removeQueries({
      queryKey: getOneMeetingTaskQueryTag(taskId),
    });
};
/**
 * Hook to fetch all meeting tasks.
 * @param meetingId
 * @returns The query result.
 */
export const useAllMeetingTasks = (meetingId) =>
  useQuery({
    queryKey: getAllMeetingTasksQueryTag(meetingId),
    queryFn: () => getAllMeetingTasks(meetingId),
  });
/**
 * Hook to fetch one meeting task.
 * @param taskId
 * @returns The query result.
 */
export const useOneMeetingTask = (taskId) =>
  useQuery({
    queryKey: getOneMeetingTaskQueryTag(taskId),
    queryFn: () => getOneMeetingTask(taskId),
  });
/**
 * Hook to create a meeting task.
 * @param meetingId - The id of the general meeting.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateMeetingTask = (meetingId, options = {}) => {
  const invalidateAllMeetingTasks = useInvalidateAllMeetingTasks(meetingId);
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllMeetingTasks();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllMeetingTasks]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      createMeetingTask(meetingId, {
        ...args,
        dueDate: changeTmzFromLocalToUTC(args.dueDate),
      }),
    mutationKey: CREATE_MEETING_TASK_MUTATION_KEY,
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
 * Hook to update a meeting task.
 * @param taskId - The id of the meeting task to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateMeetingTask = (taskId, options = {}) => {
  const invalidateOneMeetingTask = useInvalidateOneMeetingTask();
  const invalidateAllMeetingTasks = useInvalidateAllMeetingTasks();
  const invalidateOneAdministrationMeeting =
    useOneAdministrationMeetingInvalidate();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneMeetingTask(taskId);
        await invalidateAllMeetingTasks();
        if (args[0]?.meetingId) {
          await invalidateOneAdministrationMeeting(args[0].meetingId);
        }
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [
      invalidateAllMeetingTasks,
      invalidateOneAdministrationMeeting,
      invalidateOneMeetingTask,
      taskId,
    ]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      updateMeetingTask(taskId, {
        ...args,
        dueDate: args.dueDate && changeTmzFromLocalToUTC(args.dueDate),
      }),
    mutationKey: getUpdateMeetingTaskMutationKey(taskId),
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
 * Hook to mark a meeting task as completed.
 * @param taskId - The id of the meeting task to mark as completed.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useMarkMeetingTaskAsCompleted = (taskId, options = {}) => {
  const invalidateOneMeetingTask = useInvalidateOneMeetingTask();
  const invalidateAllMeetingTasks = useInvalidateAllMeetingTasks();
  const invalidateOneAdministrationMeeting =
    useOneAdministrationMeetingInvalidate();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneMeetingTask(taskId);
        await invalidateAllMeetingTasks();
        if (args[0]?.meetingId) {
          await invalidateOneAdministrationMeeting(args[0].meetingId);
        }
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [
      invalidateAllMeetingTasks,
      invalidateOneAdministrationMeeting,
      invalidateOneMeetingTask,
      taskId,
    ]
  );
  const mutation = useMutation({
    mutationFn: () => markMeetingTaskAsCompleted(taskId),
    mutationKey: getMarkMeetingTaskAsCompletedMutationKey(taskId),
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
/**
 * Hook to forward a meeting task.
 * @param taskId - The id of the meeting task to forward.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useForwardMeetingTask = (taskId, options = {}) => {
  const invalidateOneMeetingTask = useInvalidateOneMeetingTask();
  const invalidateAllMeetingTasks = useInvalidateAllMeetingTasks();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneMeetingTask(taskId);
        await invalidateAllMeetingTasks();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [taskId, invalidateAllMeetingTasks, invalidateOneMeetingTask]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      forwardMeetingTask(taskId, {
        ...args,
        dueDate: changeTmzFromLocalToUTC(args.dueDate),
      }),
    mutationKey: getForwardMeetingTaskMutationKey(taskId),
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
 * Hook to delete a meeting task.
 * @param taskId - The id of the meeting task to delete.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useDeleteMeetingTask = (taskId, options = {}) => {
  const removeOneMeetingTask = useRemoveOneMeetingTaskQuery(taskId);
  const invalidateAllMeetingTasks = useInvalidateAllMeetingTasks();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        removeOneMeetingTask();
        await invalidateAllMeetingTasks();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllMeetingTasks, removeOneMeetingTask]
  );
  const mutation = useMutation({
    mutationFn: () => deleteMeetingTask(taskId),
    mutationKey: getDeleteMeetingTaskMutationKey(taskId),
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
