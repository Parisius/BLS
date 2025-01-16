import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { changeTmzFromLocalToUTC } from "@/lib/utils";
// eslint-disable-next-line import/no-cycle
import {
  printGeneralMeeting,
  printGeneralMeetingChecklist,
  printGeneralMeetingProcedures,
  useInvalidateAllMeetingTasks,
} from "@/services/api-sdk/models/general-meeting";
import {
  addGeneralMeetingFile,
  createGeneralMeeting,
  getArchivedGeneralMeetings,
  getCurrentGeneralMeeting,
  getOneGeneralMeeting,
  updateGeneralMeeting,
} from "./requests";
/**
 * Tag for the query to fetch all general meetings
 */
export const ARCHIVED_GENERAL_MEETINGS_QUERY_KEY = [
  "GENERAL_MEETINGS/ARCHIVED_GENERAL_MEETINGS",
];
/**
 * Tag for the query to fetch the current general meeting
 */
export const CURRENT_GENERAL_MEETING_QUERY_KEY = [
  "GENERAL_MEETINGS/CURRENT_GENERAL_MEETING",
];
/**
 * Tag generator for the query to fetch one general meeting
 */
export const getOneGeneralMeetingQueryKey = (id) => [
  "GENERAL_MEETINGS/ONE_GENERAL_MEETING",
  id,
];
/**
 * Tag generator for the mutation to print a meeting.
 * @param meetingId - The id of the meeting.
 * @returns The mutation tag.
 */
export const getPrintGeneralMeetingMutationKey = (meetingId) => [
  "GENERAL_MEETING",
  "PRINT_GENERAL_MEETING",
  meetingId,
];
/**
 * Tag generator for the mutation to print a meeting checklist.
 * @param meetingId - The id of the meeting.
 * @returns The mutation tag.
 */
export const getPrintGeneralMeetingChecklistMutationKey = (meetingId) => [
  "GENERAL_MEETING",
  "PRINT_GENERAL_MEETING_CHECKLIST",
  meetingId,
];
/**
 * Tag generator for the mutation to print a meeting procedures.
 * @param meetingId - The id of the meeting.
 * @returns The mutation tag.
 */
export const getPrintGeneralMeetingProceduresMutationKey = (meetingId) => [
  "GENERAL_MEETING",
  "PRINT_GENERAL_MEETING_PROCEDURES",
  meetingId,
];
/**
 * Tag for the mutation to create a general meeting.
 */
export const CREATE_GENERAL_MEETING_MUTATION_KEY = [
  "GENERAL_MEETINGS/CREATE_GENERAL_MEETING",
];
/**
 * Tag generator for the mutation to update a general meeting.
 * @param id - The id of the general meeting to update.
 * @returns The mutation key.
 */
export const getUpdateGeneralMeetingMutationKey = (id) => [
  "GENERAL_MEETINGS/UPDATE_GENERAL_MEETING",
  id,
];
/**
 * Hook to invalidate the current general meeting query.
 * @returns A function to invalidate the current general meeting query.
 */
export const useCurrentGeneralMeetingInvalidate = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: CURRENT_GENERAL_MEETING_QUERY_KEY,
    });
};
/**
 * Hook to invalidate the one general meeting query.
 * @returns A function to invalidate the one general meeting query.
 */
export const useOneGeneralMeetingInvalidate = () => {
  const queryClient = useQueryClient();
  return (meetingId) =>
    queryClient.invalidateQueries({
      queryKey: getOneGeneralMeetingQueryKey(meetingId),
    });
};
/**
 * Hook to fetch archived general meetings.
 * @returns The query result.
 */
export const useArchivedGeneralMeetings = () =>
  useQuery({
    queryKey: ARCHIVED_GENERAL_MEETINGS_QUERY_KEY,
    queryFn: () => getArchivedGeneralMeetings(),
  });
/**
 * Hook to fetch the current general meeting.
 * @returns The query result.
 */
export const useCurrentGeneralMeeting = () =>
  useQuery({
    queryKey: CURRENT_GENERAL_MEETING_QUERY_KEY,
    queryFn: () => getCurrentGeneralMeeting(),
  });
/**
 * Hook to fetch a general meeting by its id.
 * @param id
 * @returns The query result.
 */
export const useOneGeneralMeeting = (id) =>
  useQuery({
    queryKey: getOneGeneralMeetingQueryKey(id),
    queryFn: () => getOneGeneralMeeting(id),
  });
/**
 * Hook to create a general meeting.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateGeneralMeeting = (options = {}) => {
  const invalidateCurrentGeneralMeeting = useCurrentGeneralMeetingInvalidate();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateCurrentGeneralMeeting();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateCurrentGeneralMeeting]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      createGeneralMeeting({
        ...args,
        meetingDate: changeTmzFromLocalToUTC(args.meetingDate),
      }),
    mutationKey: CREATE_GENERAL_MEETING_MUTATION_KEY,
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
 * Hook to update a general meeting.
 * @param meetingId - The id of the general meeting to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateGeneralMeeting = (meetingId, options) => {
  const invalidateOneGeneralMeeting = useOneGeneralMeetingInvalidate();
  const invalidateAllMeetingTasks = useInvalidateAllMeetingTasks(meetingId);
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneGeneralMeeting(meetingId);
        await invalidateAllMeetingTasks();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllMeetingTasks, invalidateOneGeneralMeeting, meetingId]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      updateGeneralMeeting(meetingId, {
        ...args,
        meetingDate:
          args.meetingDate && changeTmzFromLocalToUTC(args.meetingDate),
      }),
    mutationKey: getUpdateGeneralMeetingMutationKey(meetingId),
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
 * Hook to add a file to a general meeting.
 * @param meetingId - The id of the general meeting.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useAddGeneralMeetingFile = (meetingId, options = {}) => {
  const invalidateOneGeneralMeeting = useOneGeneralMeetingInvalidate();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneGeneralMeeting(meetingId);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateOneGeneralMeeting, meetingId]
  );
  const mutation = useMutation({
    mutationFn: (args) => {
      const formData = new FormData();
      formData.set("file", args.file);
      return addGeneralMeetingFile(meetingId, {
        fileType: args.fileType,
        formData,
      });
    },
    mutationKey: getUpdateGeneralMeetingMutationKey(meetingId),
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
 * Hook to print a meeting.
 * @param meetingId - The id of the meeting to print.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const usePrintGeneralMeeting = (meetingId, options) => {
  const mutation = useMutation({
    mutationFn: () => printGeneralMeeting(meetingId),
    mutationKey: getPrintGeneralMeetingMutationKey(meetingId),
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
/**
 * Hook to print a meeting checklist.
 * @param meetingId - The id of the meeting.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const usePrintGeneralMeetingChecklist = (meetingId, options) => {
  const mutation = useMutation({
    mutationFn: () => printGeneralMeetingChecklist(meetingId),
    mutationKey: getPrintGeneralMeetingChecklistMutationKey(meetingId),
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
/**
 * Hook to print a meeting procedures.
 * @param meetingId - The id of the meeting.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const usePrintGeneralMeetingProcedures = (meetingId, options) => {
  const mutation = useMutation({
    mutationFn: () => printGeneralMeetingProcedures(meetingId),
    mutationKey: getPrintGeneralMeetingProceduresMutationKey(meetingId),
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
