import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { changeTmzFromLocalToUTC } from "@/lib/utils";
import {
  createContractEvent,
  deleteContractEvent,
  forwardContractEvent,
  getAllContractEvents,
  getOneContractEvent,
  markContractEventAsCompleted,
  updateContractEvent,
} from "./requests";
/**
 * Tag generator for the query to fetch all contract events
 * @param contractId - The id of the contract.
 * @returns The query tag.
 */
export const getAllContractEventsQueryTag = (contractId) =>
  ["CONTRACT_EVENTS", "ALL_CONTRACT_EVENTS", contractId].filter(Boolean);
/**
 * Tag generator for the query to fetch one contract event
 * @param eventId - The id of the contract event.
 * @returns The query tag.
 */
export const getOneContractEventQueryTag = (eventId) => [
  "CONTRACT_EVENTS",
  "ONE_CONTRACT_EVENT",
  eventId,
];
/**
 * Tag for the mutation to create a contract event.
 */
export const CREATE_CONTRACT_EVENT_MUTATION_KEY = [
  "CONTRACT_EVENTS",
  "CREATE_CONTRACT_EVENT",
];
/**
 * Tag generator for the mutation to update a contract event.
 * @param eventId - The id of the contract event to update.
 * @returns The mutation key.
 */
export const getUpdateContractEventMutationKey = (eventId) => [
  "CONTRACT_EVENTS",
  "UPDATE_CONTRACT_EVENT",
  eventId,
];
/**
 * Tag generator for the mutation to forward a contract event.
 * @param eventId - The id of the contract event to forward.
 * @returns The mutation key
 */
export const getForwardContractEventMutationKey = (eventId) => [
  "CONTRACT_EVENTS",
  "FORWARD_CONTRACT_EVENT",
  eventId,
];
/**
 * Tag generator for the mutation to mark a contract event as completed.
 * @param eventId
 * @returns The mutation key.
 */
export const getMarkContractEventAsCompletedMutationKey = (eventId) => [
  "CONTRACT_EVENTS",
  "MARK_CONTRACT_EVENT_AS_COMPLETED",
  eventId,
];
export const getDeleteContractEventMutationKey = (eventId) => [
  "CONTRACT_EVENTS",
  "DELETE_CONTRACT_EVENT",
  eventId,
];
/**
 * Hook to invalidate all contract events query.
 * @returns A function to invalidate the all contract events query.
 */
export const useInvalidateAllContractEvents = () => {
  const queryClient = useQueryClient();
  return (contractId) =>
    queryClient.invalidateQueries({
      queryKey: getAllContractEventsQueryTag(contractId),
    });
};
/**
 * Hook to invalidate the one contract event query.
 * @returns A function to invalidate the one contract event query.
 */
export const useInvalidateOneContractEvent = () => {
  const queryClient = useQueryClient();
  return (eventId) =>
    queryClient.invalidateQueries({
      queryKey: getOneContractEventQueryTag(eventId),
    });
};
/**
 * Hook to remove the one contract event query.
 * @returns A function to remove the one contract event query.
 */
export const useRemoveOneContractEventQuery = () => {
  const queryClient = useQueryClient();
  return (eventId) =>
    queryClient.removeQueries({
      queryKey: getOneContractEventQueryTag(eventId),
    });
};
/**
 * Hook to fetch all contract events.
 * @param contractId - The id of the contract.
 * @returns The query result.
 */
export const useAllContractEvents = (contractId) =>
  useQuery({
    queryKey: getAllContractEventsQueryTag(contractId),
    queryFn: () => getAllContractEvents(contractId),
  });
/**
 * Hook to fetch one contract event.
 * @param eventId - The id of the contract event.
 * @returns The query result.
 */
export const useOneContractEvent = (eventId) =>
  useQuery({
    queryKey: getOneContractEventQueryTag(eventId),
    queryFn: () => getOneContractEvent(eventId),
  });
/**
 * Hook to create a contract event.
 * @param contractId - The id of the contract.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateContractEvent = (contractId, options = {}) => {
  const invalidateAllContractEvents = useInvalidateAllContractEvents();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllContractEvents();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllContractEvents]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      createContractEvent(contractId, {
        ...args,
        dueDate: changeTmzFromLocalToUTC(args.dueDate),
      }),
    mutationKey: CREATE_CONTRACT_EVENT_MUTATION_KEY,
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
 * Hook to update a contract event.
 * @param eventId - The id of the contract event to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateContractEvent = (eventId, options) => {
  const invalidateOneContractEvent = useInvalidateOneContractEvent();
  const invalidateAllContractEvents = useInvalidateAllContractEvents();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneContractEvent(eventId);
        await invalidateAllContractEvents();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [eventId, invalidateAllContractEvents, invalidateOneContractEvent]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      updateContractEvent(eventId, {
        ...args,
        dueDate: args.dueDate && changeTmzFromLocalToUTC(args.dueDate),
      }),
    mutationKey: getUpdateContractEventMutationKey(eventId),
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
 * Hook to forward a contract event.
 * @param eventId - The id of the contract event to forward.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useForwardContractEvent = (eventId, options) => {
  const invalidateOneContractEvent = useInvalidateOneContractEvent();
  const invalidateAllContractEvents = useInvalidateAllContractEvents();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneContractEvent(eventId);
        await invalidateAllContractEvents();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [eventId, invalidateAllContractEvents, invalidateOneContractEvent]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      forwardContractEvent(eventId, {
        ...args,
        dueDate: changeTmzFromLocalToUTC(args.dueDate),
      }),
    mutationKey: getForwardContractEventMutationKey(eventId),
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
 * Hook to mark a contract event as completed.
 * @param eventId - The id of the contract event to mark as completed.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useMarkContractEventAsCompleted = (eventId, options) => {
  const invalidateOneContractEvent = useInvalidateOneContractEvent();
  const invalidateAllContractEvents = useInvalidateAllContractEvents();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneContractEvent(eventId);
        await invalidateAllContractEvents();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [eventId, invalidateAllContractEvents, invalidateOneContractEvent]
  );
  const mutation = useMutation({
    mutationFn: () => markContractEventAsCompleted(eventId),
    mutationKey: getMarkContractEventAsCompletedMutationKey(eventId),
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
 * Hook to delete a contract event.
 * @param eventId - The id of the contract event to delete.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useDeleteContractEvent = (eventId, options) => {
  const removeOneContractEvent = useRemoveOneContractEventQuery();
  const invalidateAllContractEvents = useInvalidateAllContractEvents();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        removeOneContractEvent(eventId);
        await invalidateAllContractEvents();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [eventId, invalidateAllContractEvents, removeOneContractEvent]
  );
  const mutation = useMutation({
    mutationFn: () => deleteContractEvent(eventId),
    mutationKey: getDeleteContractEventMutationKey(eventId),
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
