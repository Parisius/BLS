import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { changeTmzFromLocalToUTC } from "@/lib/utils";
// eslint-disable-next-line import/no-cycle
import { useInvalidateOneRecovery } from "@/services/api-sdk/models/recovery";
import { deleteRecoveryStep } from "@/services/api-sdk/models/recovery/recovery-step";
import {
  completeRecoveryStep,
  createRecoveryStep,
  forwardRecoveryStep,
  getAllRecoverySteps,
  getOneRecoveryStep,
  updateRecoveryStep,
} from "./requests";
/**
 * Tag generator for the query to fetch all recovery steps.
 * @param recoveryId - The id of the recovery
 * @returns The query tag.
 */
export const getAllRecoveryStepsQueryTag = (recoveryId) =>
  ["RECOVERY_STEPS", "ALL_RECOVERY_STEPS", recoveryId].filter(Boolean);
/**
 * Tag generator for the query to fetch one recovery step.
 * @param stepId - The id of the recovery step.
 * @returns The query tag.
 */
export const getOneRecoveryStepQueryTag = (stepId) => [
  "RECOVERY_STEPS",
  "ONE_RECOVERY_STEP",
  stepId,
];
/**
 * Tag for the mutation to create a recovery step.
 */
export const CREATE_RECOVERY_STEP_MUTATION_KEY = [
  "RECOVERY_STEPS",
  "CREATE_RECOVERY_STEP",
];
/**
 * Tag generator for the mutation to update a recovery step.
 * @param stepId - The id of the recovery step to update.
 * @returns The mutation key.
 */
export const getUpdateRecoveryStepMutationKey = (stepId) => [
  "RECOVERY_STEPS",
  "UPDATE_RECOVERY_STEP",
  stepId,
];
export const getDeleteRecoveryStepMutationKey = (stepId) => [
  "RECOVERY_STEPS",
  "DELETE_RECOVERY_STEP",
  stepId,
];
/**
 * Tag generator for the mutation to forward a recovery step.
 * @param stepId - The id of the recovery step to forward.
 * @returns The mutation key
 */
export const getForwardRecoveryStepMutationKey = (stepId) => [
  "RECOVERY_STEPS",
  "FORWARD_RECOVERY_STEP",
  stepId,
];
export const getCompleteRecoveryStepMutationKey = (stepId) => [
  "RECOVERY_STEPS",
  "COMPLETE_RECOVERY_STEP",
  stepId,
];
/**
 * Hook to invalidate all recovery steps query.
 * @returns A function to invalidate the all recovery steps query.
 */
export const useInvalidateAllRecoverySteps = () => {
  const queryClient = useQueryClient();
  return (recoveryId) =>
    queryClient.invalidateQueries({
      queryKey: getAllRecoveryStepsQueryTag(recoveryId),
    });
};
/**
 * Hook to invalidate the one recovery step query.
 * @returns A function to invalidate the one recovery step query.
 */
export const useInvalidateOneRecoveryStep = () => {
  const queryClient = useQueryClient();
  return (stepId) =>
    queryClient.invalidateQueries({
      queryKey: getOneRecoveryStepQueryTag(stepId),
    });
};
/**
 * Hook to remove the one recovery step query.
 * @returns A function to remove the one recovery step query.
 */
export const useRemoveOneRecoveryStepQuery = () => {
  const queryClient = useQueryClient();
  return (stepId) =>
    queryClient.removeQueries({
      queryKey: getOneRecoveryStepQueryTag(stepId),
    });
};
/**
 * Hook to fetch all recovery steps.
 * @param recoveryId - The id of the recovery.
 * @returns The query result.
 */
export const useAllRecoverySteps = (recoveryId) =>
  useQuery({
    queryKey: getAllRecoveryStepsQueryTag(recoveryId),
    queryFn: () => getAllRecoverySteps(recoveryId),
  });
/**
 * Hook to fetch one recovery step.
 * @param stepId - The id of the recovery step.
 * @returns The query result.
 */
export const useOneRecoveryStep = (stepId) =>
  useQuery({
    queryKey: getOneRecoveryStepQueryTag(stepId),
    queryFn: () => getOneRecoveryStep(stepId),
  });
/**
 * Hook to create a recovery step.
 * @param recoveryId - The id of the recovery.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateRecoveryStep = (recoveryId, options = {}) => {
  const invalidateAllRecoverySteps = useInvalidateAllRecoverySteps();
  const invalidateOneRecovery = useInvalidateOneRecovery();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllRecoverySteps();
        await invalidateOneRecovery(recoveryId);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllRecoverySteps, invalidateOneRecovery, recoveryId]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      createRecoveryStep(recoveryId, {
        ...args,
        dueDate: changeTmzFromLocalToUTC(args.dueDate),
      }),
    mutationKey: CREATE_RECOVERY_STEP_MUTATION_KEY,
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
 * Hook to update a recovery step.
 * @param stepId - The id of the recovery step to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateRecoveryStep = (stepId, options = {}) => {
  const invalidateOneRecoveryStep = useInvalidateOneRecoveryStep();
  const invalidateAllRecoverySteps = useInvalidateAllRecoverySteps();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneRecoveryStep(stepId);
        await invalidateAllRecoverySteps();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [stepId, invalidateAllRecoverySteps, invalidateOneRecoveryStep]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      updateRecoveryStep(stepId, {
        ...args,
        dueDate: args.dueDate && changeTmzFromLocalToUTC(args.dueDate),
      }),
    mutationKey: getUpdateRecoveryStepMutationKey(stepId),
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
 * Hook to complete a recovery step.
 * @param stepId - The id of the recovery step.
 * @param options - The options for the mutation.
 * @returns The mutation object.
 */
export const useCompleteRecoveryStep = (stepId, options = {}) => {
  const invalidateAllRecoverySteps = useInvalidateAllRecoverySteps();
  const invalidateOneRecoveryStep = useInvalidateOneRecoveryStep();
  const invalidateOneRecovery = useInvalidateOneRecovery();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllRecoverySteps();
        if (args[0]) {
          await invalidateOneRecoveryStep(stepId);
          await invalidateOneRecovery(args[0].recoveryId);
        }
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [
      invalidateAllRecoverySteps,
      invalidateOneRecovery,
      invalidateOneRecoveryStep,
      stepId,
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
      return completeRecoveryStep(stepId, newArgs);
    },
    mutationKey: getCompleteRecoveryStepMutationKey(stepId),
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
 * Hook to forward a recovery step.
 * @param stepId - The id of the recovery step to forward.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useForwardRecoveryStep = (stepId, options = {}) => {
  const invalidateOneRecoveryStep = useInvalidateOneRecoveryStep();
  const invalidateAllRecoverySteps = useInvalidateAllRecoverySteps();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneRecoveryStep(stepId);
        await invalidateAllRecoverySteps();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [stepId, invalidateAllRecoverySteps, invalidateOneRecoveryStep]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      forwardRecoveryStep(stepId, {
        ...args,
        dueDate: changeTmzFromLocalToUTC(args.dueDate),
      }),
    mutationKey: getForwardRecoveryStepMutationKey(stepId),
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
 * Hook to delete a recovery step.
 * @param stepId - The id of the recovery step to delete.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useDeleteRecoveryStep = (stepId, options = {}) => {
  const removeOneRecoveryStep = useRemoveOneRecoveryStepQuery();
  const invalidateAllRecoverySteps = useInvalidateAllRecoverySteps();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        removeOneRecoveryStep(stepId);
        await invalidateAllRecoverySteps();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [stepId, invalidateAllRecoverySteps, removeOneRecoveryStep]
  );
  const mutation = useMutation({
    mutationFn: () => deleteRecoveryStep(stepId),
    mutationKey: getDeleteRecoveryStepMutationKey(stepId),
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
