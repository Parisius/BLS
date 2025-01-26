import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { changeTmzFromLocalToUTC } from "@/lib/utils";
import { useInvalidateOneLitigation } from "@/services/api-sdk/models/litigation";
import {
  completeLitigationTask,
  createLitigationTask,
  deleteLitigationTask,
  forwardLitigationTask,
  getAllLitigationTasks,
  getOneLitigationTask,
  updateLitigationTask,
} from "./requests";
/**
 * Tag generator for the query to fetch all litigation tasks.
 * @param litigationId - The id of the litigation
 * @returns The query tag.
 */
export const getAllLitigationTasksQueryTag = (litigationId) =>
  ["LITIGATION_TASKS", "ALL_LITIGATION_TASKS", litigationId].filter(Boolean);
/**
 * Tag generator for the query to fetch one litigation task.
 * @param taskId - The id of the litigation task.
 * @returns The query tag.
 */
export const getOneLitigationTaskQueryTag = (taskId) => [
  "LITIGATION_TASKS",
  "ONE_LITIGATION_TASK",
  taskId,
];
/**
 * Tag for the mutation to create a litigation task.
 */
export const CREATE_LITIGATION_TASK_MUTATION_KEY = [
  "LITIGATION_TASKS",
  "CREATE_LITIGATION_TASK",
];
/**
 * Tag generator for the mutation to update a litigation task.
 * @param taskId - The id of the litigation task to update.
 * @returns The mutation key.
 */
export const getUpdateLitigationTaskMutationKey = (taskId) => [
  "LITIGATION_TASKS",
  "UPDATE_LITIGATION_TASK",
  taskId,
];
export const getDeleteLitigationTaskMutationKey = (taskId) => [
  "LITIGATION_TASKS",
  "DELETE_LITIGATION_TASK",
  taskId,
];
/**
 * Tag generator for the mutation to forward a litigation task.
 * @param taskId - The id of the litigation task to forward.
 * @returns The mutation key
 */
export const getForwardLitigationTaskMutationKey = (taskId) => [
  "LITIGATION_TASKS",
  "FORWARD_LITIGATION_TASK",
  taskId,
];
export const getCompleteLitigationTaskMutationKey = (taskId) => [
  "LITIGATION_TASKS",
  "COMPLETE_LITIGATION_TASK",
  taskId,
];
/**
 * Hook to invalidate all litigation tasks query.
 * @returns A function to invalidate the all litigation tasks query.
 */
export const useInvalidateAllLitigationTasks = () => {
  const queryClient = useQueryClient();
  return (litigationId) =>
    queryClient.invalidateQueries({
      queryKey: getAllLitigationTasksQueryTag(litigationId),
    });
};
/**
 * Hook to invalidate the one litigation task query.
 * @returns A function to invalidate the one litigation task query.
 */
export const useInvalidateOneLitigationTask = () => {
  const queryClient = useQueryClient();
  return (taskId) =>
    queryClient.invalidateQueries({
      queryKey: getOneLitigationTaskQueryTag(taskId),
    });
};
/**
 * Hook to remove the one litigation task query.
 * @returns A function to remove the one litigation task query.
 */
export const useRemoveOneLitigationTaskQuery = () => {
  const queryClient = useQueryClient();
  return (taskId) =>
    queryClient.removeQueries({
      queryKey: getOneLitigationTaskQueryTag(taskId),
    });
};
/**
 * Hook to fetch all litigation tasks.
 * @param litigationId - The id of the litigation.
 * @returns The query result.
 */
export const useAllLitigationTasks = (litigationId) =>
  useQuery({
    queryKey: getAllLitigationTasksQueryTag(litigationId),
    queryFn: () => getAllLitigationTasks(litigationId),
  });
/**
 * Hook to fetch one litigation task.
 * @param taskId - The id of the litigation task.
 * @returns The query result.
 */
export const useOneLitigationTask = (taskId) =>
  useQuery({
    queryKey: getOneLitigationTaskQueryTag(taskId),
    queryFn: () => getOneLitigationTask(taskId),
  });
/**
 * Hook to create a litigation task.
 * @param litigationId - The id of the litigation.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateLitigationTask = (litigationId, options = {}) => {
  const invalidateAllLitigationTasks = useInvalidateAllLitigationTasks();
  const invalidateOneLitigation = useInvalidateOneLitigation();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllLitigationTasks();
        await invalidateOneLitigation(litigationId);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllLitigationTasks, invalidateOneLitigation, litigationId]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      createLitigationTask(litigationId, {
        ...args,
        dueDate: changeTmzFromLocalToUTC(args.dueDate),
      }),
    mutationKey: CREATE_LITIGATION_TASK_MUTATION_KEY,
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
 * Hook to update a litigation task.
 * @param taskId - The id of the litigation task to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateLitigationTask = (taskId, options = {}) => {
  const invalidateOneLitigationTask = useInvalidateOneLitigationTask();
  const invalidateAllLitigationTasks = useInvalidateAllLitigationTasks();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneLitigationTask(taskId);
        await invalidateAllLitigationTasks();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [taskId, invalidateAllLitigationTasks, invalidateOneLitigationTask]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      updateLitigationTask(taskId, {
        ...args,
        dueDate: args.dueDate && changeTmzFromLocalToUTC(args.dueDate),
      }),
    mutationKey: getUpdateLitigationTaskMutationKey(taskId),
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
 * Hook to complete a litigation task.
 * @param taskId - The id of the litigation task.
 * @param options - The options for the mutation.
 * @returns The mutation object.
 */
export const useCompleteLitigationTask = (taskId, options = {}) => {
  const invalidateAllLitigationTasks = useInvalidateAllLitigationTasks();
  const invalidateOneLitigationTask = useInvalidateOneLitigationTask();
  const invalidateOneLitigation = useInvalidateOneLitigation();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllLitigationTasks();
        if (args[0]) {
          await invalidateOneLitigationTask(taskId);
          await invalidateOneLitigation(args[0].litigationId);
        }
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [
      invalidateAllLitigationTasks,
      invalidateOneLitigation,
      invalidateOneLitigationTask,
      taskId,
    ]
  );
  const mutation = useMutation({
    mutationFn: (args) => {
      const newArgs = args
        ? Object.entries(args).reduce((acc, [key, value]) => {
            if (value instanceof Date) {
              return {
                ...acc,
                [key]: changeTmzFromLocalToUTC(value),
              };
            }
            if (typeof value === "string" || typeof value === "number") {
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
          }, {})
        : undefined;
      return completeLitigationTask(taskId, newArgs);
    },
    mutationKey: getCompleteLitigationTaskMutationKey(taskId),
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
 * Hook to forward a litigation task.
 * @param taskId - The id of the litigation task to forward.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useForwardLitigationTask = (taskId, options = {}) => {
  const invalidateOneLitigationTask = useInvalidateOneLitigationTask();
  const invalidateAllLitigationTasks = useInvalidateAllLitigationTasks();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneLitigationTask(taskId);
        await invalidateAllLitigationTasks();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [taskId, invalidateAllLitigationTasks, invalidateOneLitigationTask]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      forwardLitigationTask(taskId, {
        ...args,
        dueDate: changeTmzFromLocalToUTC(args.dueDate),
      }),
    mutationKey: getForwardLitigationTaskMutationKey(taskId),
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
 * Hook to delete a litigation task.
 * @param taskId - The id of the litigation task to delete.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useDeleteLitigationTask = (taskId, options = {}) => {
  const removeOneLitigationTask = useRemoveOneLitigationTaskQuery();
  const invalidateAllLitigationTasks = useInvalidateAllLitigationTasks();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        removeOneLitigationTask(taskId);
        await invalidateAllLitigationTasks();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [taskId, invalidateAllLitigationTasks, removeOneLitigationTask]
  );
  const mutation = useMutation({
    mutationFn: () => deleteLitigationTask(taskId),
    mutationKey: getDeleteLitigationTaskMutationKey(taskId),
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
