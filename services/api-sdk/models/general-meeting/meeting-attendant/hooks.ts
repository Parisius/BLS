import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  createMeetingAttendant,
  deleteMeetingAttendant,
  getAllMeetingAttendants,
  getOneMeetingAttendant,
  printMeetingAttendantsList,
  updateMeetingAttendant,
  updateMeetingAttendantsStatus,
} from "./requests";
/**
 * Tag generator for the query to fetch all meeting attendants.
 * @param meetingId - The id of the general meeting.
 * @returns The query tag.
 */
export const getAllMeetingAttendantsQueryTag = (meetingId) =>
  ["MEETING_ATTENDANT/ALL_MEETING_ATTENDANTS", meetingId].filter(Boolean);
/**
 * Tag generator for the query to fetch one meeting attendant.
 * @param attendantId - The id of the meeting attendant.
 * @returns The query tag.
 */
export const getOneMeetingAttendantQueryTag = (attendantId) => [
  "MEETING_ATTENDANT/ONE_MEETING_ATTENDANT",
  attendantId,
];
/**
 * Tag generator for the mutation to print a meeting attendants list.
 * @param meetingId - The id of the meeting.
 * @returns The mutation tag.
 */
export const getPrintMeetingAttendantsListMutationKey = (meetingId) => [
  "MEETING_ATTENDANT",
  "PRINT_MEETING_ATTENDANTS_LIST",
  meetingId,
];
/**
 * Tag for the mutation to create a meeting attendant.
 */
export const CREATE_MEETING_ATTENDANT_MUTATION_KEY = [
  "MEETING_ATTENDANT/CREATE_MEETING_ATTENDANT",
];
/**
 * Tag for the mutation to update meeting attendants status.
 */
export const UPDATE_MEETING_ATTENDANTS_STATUS_MUTATION_KEY = [
  "MEETING_ATTENDANT/UPDATE_MEETING_ATTENDANTS_STATUS",
];
/**
 * Tag generator for the mutation to update a meeting attendant.
 * @param attendantId - The id of the meeting attendant to update.
 * @returns The mutation key.
 */
export const getUpdateMeetingAttendantMutationKey = (attendantId) => [
  "MEETING_ATTENDANT/UPDATE_MEETING_ATTENDANT",
  attendantId,
];
/**
 * Hook to invalidate all meeting attendants query.
 * @param meetingId - The id of the general meeting.
 * @returns A function to invalidate the all meeting attendants query.
 */
export const useInvalidateAllMeetingAttendants = (meetingId) => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: getAllMeetingAttendantsQueryTag(meetingId),
    });
};
/**
 * Hook to invalidate the one meeting attendant query.
 * @returns A function to invalidate the one meeting attendant query.
 */
export const useInvalidateOneMeetingAttendant = () => {
  const queryClient = useQueryClient();
  return (attendantId) =>
    queryClient.invalidateQueries({
      queryKey: getOneMeetingAttendantQueryTag(attendantId),
    });
};
/**
 * Hook to remove the one meeting attendant query.
 * @returns A function to remove the one meeting attendant query.
 */
export const useRemoveOneMeetingAttendantQuery = () => {
  const queryClient = useQueryClient();
  return (attendantId) =>
    queryClient.removeQueries({
      queryKey: getOneMeetingAttendantQueryTag(attendantId),
    });
};
/**
 * Hook to fetch all meeting attendants.
 * @param meetingId - The id of the general meeting.
 * @returns The query result.
 */
export const useAllMeetingAttendants = (meetingId) =>
  useQuery({
    queryKey: getAllMeetingAttendantsQueryTag(meetingId),
    queryFn: () => getAllMeetingAttendants(meetingId),
  });
/**
 * Hook to fetch one meeting attendant.
 * @param attendantId - The id of the meeting attendant.
 * @returns The query result.
 */
export const useOneMeetingAttendant = (attendantId) =>
  useQuery({
    queryKey: getOneMeetingAttendantQueryTag(attendantId),
    queryFn: () => getOneMeetingAttendant(attendantId),
  });
/**
 * Hook to create a meeting attendant.
 * @param meetingId - The id of the general meeting.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateMeetingAttendant = (meetingId, options = {}) => {
  const invalidateAllMeetingAttendants =
    useInvalidateAllMeetingAttendants(meetingId);
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllMeetingAttendants();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllMeetingAttendants]
  );
  const mutation = useMutation({
    mutationFn: (...args) => createMeetingAttendant(meetingId, ...args),
    mutationKey: CREATE_MEETING_ATTENDANT_MUTATION_KEY,
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
 * Hook to update a meeting attendant.
 * @param attendantId - The id of the meeting attendant to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateMeetingAttendant = (attendantId, options) => {
  const invalidateOneMeetingAttendant = useInvalidateOneMeetingAttendant();
  const invalidateAllMeetingAttendants = useInvalidateAllMeetingAttendants();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneMeetingAttendant(attendantId);
        await invalidateAllMeetingAttendants();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateOneMeetingAttendant, attendantId, invalidateAllMeetingAttendants]
  );
  const mutation = useMutation({
    mutationFn: (args) => updateMeetingAttendant(attendantId, args),
    mutationKey: getUpdateMeetingAttendantMutationKey(attendantId),
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
 * Hook to update the status of meeting attendants.
 * @param meetingId - The id of the general meeting.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateMeetingAttendantsStatus = (meetingId, options) => {
  const invalidateAllMeetingAttendants = useInvalidateAllMeetingAttendants();
  const invalidateOneMeetingAttendant = useInvalidateOneMeetingAttendant();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllMeetingAttendants();
        await Promise.all(
          args[2].attendants.map(async (attendant) => {
            await invalidateOneMeetingAttendant(attendant.id);
          })
        );
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllMeetingAttendants, invalidateOneMeetingAttendant]
  );
  const mutation = useMutation({
    mutationFn: (args) => updateMeetingAttendantsStatus(meetingId, args),
    mutationKey: UPDATE_MEETING_ATTENDANTS_STATUS_MUTATION_KEY,
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
 * Hook to delete a meeting attendant.
 * @param attendantId - The id of the meeting attendant to delete.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useDeleteMeetingAttendant = (attendantId, options = {}) => {
  const invalidateAllMeetingAttendants = useInvalidateAllMeetingAttendants();
  const removeOneMeetingTask = useRemoveOneMeetingAttendantQuery();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllMeetingAttendants();
        removeOneMeetingTask(attendantId);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllMeetingAttendants, removeOneMeetingTask, attendantId]
  );
  const mutation = useMutation({
    mutationFn: () => deleteMeetingAttendant(attendantId),
    mutationKey: getOneMeetingAttendantQueryTag(attendantId),
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
 * Hook to print a meeting attendants list.
 * @param meetingId - The id of the meeting.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const usePrintMeetingAttendantsList = (meetingId, options = {}) => {
  const mutation = useMutation({
    mutationFn: () => printMeetingAttendantsList(meetingId),
    mutationKey: getPrintMeetingAttendantsListMutationKey(meetingId),
    ...options,
  });
  const mutate = (mutateOptions) => mutation.mutate(undefined, mutateOptions);
  const mutateAsync = (mutateOptions) =>
    mutation.mutateAsync(undefined, mutateOptions);
  return {
    ...mutation,
    mutate,
    mutateAsync,
  };
};
