import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { changeTmzFromLocalToUTC } from "@/lib/utils";
// eslint-disable-next-line import/no-cycle
import {
  printAdministrationMeeting,
  printAdministrationMeetingChecklist,
  printAdministrationMeetingProcedures,
  useInvalidateAllMeetingTasks,
} from "@/services/api-sdk/models/administration-meeting";
import {
  addAdministrationMeetingFile,
  createAdministrationMeeting,
  getArchivedAdministrationMeetings,
  getCurrentAdministrationMeeting,
  getOneAdministrationMeeting,
  updateAdministrationMeeting,
} from "./requests";
/**
 * Tag for the query to fetch all administration meetings
 */
export const ARCHIVED_ADMINISTRATION_MEETINGS_QUERY_KEY = [
  "ADMINISTRATION_MEETINGS/ARCHIVED_ADMINISTRATION_MEETINGS",
];
/**
 * Tag for the query to fetch the current administration meeting
 */
export const CURRENT_ADMINISTRATION_MEETING_QUERY_KEY = [
  "ADMINISTRATION_MEETINGS/CURRENT_ADMINISTRATION_MEETING",
];
/**
 * Tag generator for the query to fetch one administration meeting
 */
export const getOneAdministrationMeetingQueryKey = (id) => [
  "ADMINISTRATION_MEETINGS/ONE_ADMINISTRATION_MEETING",
  id,
];
/**
 * Tag for the mutation to create a administration meeting.
 */
export const CREATE_ADMINISTRATION_MEETING_MUTATION_KEY = [
  "ADMINISTRATION_MEETINGS/CREATE_ADMINISTRATION_MEETING",
];
/**
 * Tag generator for the mutation to update a administration meeting.
 * @param id - The id of the administration meeting to update.
 * @returns The mutation key.
 */
export const getUpdateAdministrationMeetingMutationKey = (id) => [
  "ADMINISTRATION_MEETINGS/UPDATE_ADMINISTRATION_MEETING",
  id,
];
/**
 * Tag generator for the mutation to print a meeting.
 * @param meetingId - The id of the meeting.
 * @returns The mutation tag.
 */
export const getPrintAdministrationMeetingMutationKey = (meetingId) => [
  "ADMINISTRATION_MEETING",
  "PRINT_ADMINISTRATION_MEETING",
  meetingId,
];
/**
 * Tag generator for the mutation to print a meeting checklist.
 * @param meetingId - The id of the meeting.
 * @returns The mutation tag.
 */
export const getPrintAdministrationMeetingChecklistMutationKey = (
  meetingId
) => [
  "ADMINISTRATION_MEETING",
  "PRINT_ADMINISTRATION_MEETING_CHECKLIST",
  meetingId,
];
/**
 * Tag generator for the mutation to print a meeting procedures.
 * @param meetingId - The id of the meeting.
 * @returns The mutation tag.
 */
export const getPrintAdministrationMeetingProceduresMutationKey = (
  meetingId
) => [
  "ADMINISTRATION_MEETING",
  "PRINT_ADMINISTRATION_MEETING_PROCEDURES",
  meetingId,
];
/**
 * Hook to invalidate the current administration meeting query.
 * @returns A function to invalidate the current administration meeting query.
 */
export const useCurrentAdministrationMeetingInvalidate = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: CURRENT_ADMINISTRATION_MEETING_QUERY_KEY,
    });
};
/**
 * Hook to invalidate the one administration meeting query.
 * @returns A function to invalidate the one administration meeting query.
 */
export const useOneAdministrationMeetingInvalidate = () => {
  const queryClient = useQueryClient();
  return (meetingId) =>
    queryClient.invalidateQueries({
      queryKey: getOneAdministrationMeetingQueryKey(meetingId),
    });
};
/**
 * Hook to fetch archived administration meetings.
 * @returns The query result.
 */
export const useArchivedAdministrationMeetings = () =>
  useQuery({
    queryKey: ARCHIVED_ADMINISTRATION_MEETINGS_QUERY_KEY,
    queryFn: () => getArchivedAdministrationMeetings(),
  });
/**
 * Hook to fetch the current administration meeting.
 * @returns The query result.
 */
export const useCurrentAdministrationMeeting = () =>
  useQuery({
    queryKey: CURRENT_ADMINISTRATION_MEETING_QUERY_KEY,
    queryFn: () => getCurrentAdministrationMeeting(),
  });
/**
 * Hook to fetch a administration meeting by its id.
 * @param id
 * @returns The query result.
 */
export const useOneAdministrationMeeting = (id) =>
  useQuery({
    queryKey: getOneAdministrationMeetingQueryKey(id),
    queryFn: () => getOneAdministrationMeeting(id),
  });
/**
 * Hook to create a administration meeting.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateAdministrationMeeting = (options = {}) => {
  const invalidateCurrentAdministrationMeeting =
    useCurrentAdministrationMeetingInvalidate();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateCurrentAdministrationMeeting();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateCurrentAdministrationMeeting]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      createAdministrationMeeting({
        ...args,
        meetingDate: changeTmzFromLocalToUTC(args.meetingDate),
      }),
    mutationKey: CREATE_ADMINISTRATION_MEETING_MUTATION_KEY,
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
 * Hook to update a administration meeting.
 * @param meetingId - The id of the administration meeting to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateAdministrationMeeting = (meetingId, options) => {
  const invalidateOneAdministrationMeeting =
    useOneAdministrationMeetingInvalidate();
  const invalidateAllMeetingTasks = useInvalidateAllMeetingTasks(meetingId);
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneAdministrationMeeting(meetingId);
        await invalidateAllMeetingTasks();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllMeetingTasks, invalidateOneAdministrationMeeting, meetingId]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      updateAdministrationMeeting(meetingId, {
        ...args,
        meetingDate:
          args.meetingDate && changeTmzFromLocalToUTC(args.meetingDate),
      }),
    mutationKey: getUpdateAdministrationMeetingMutationKey(meetingId),
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
 * Hook to add a file to a administration meeting.
 * @param meetingId - The id of the administration meeting.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useAddAdministrationMeetingFile = (meetingId, options = {}) => {
  const invalidateOneAdministrationMeeting =
    useOneAdministrationMeetingInvalidate();
  const invalidateAllMeetingTasks = useInvalidateAllMeetingTasks(meetingId);
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneAdministrationMeeting(meetingId);
        await invalidateAllMeetingTasks();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllMeetingTasks, invalidateOneAdministrationMeeting, meetingId]
  );
  const mutation = useMutation({
    mutationFn: (args) => {
      const formData = new FormData();
      formData.set("file", args.file);
      return addAdministrationMeetingFile(meetingId, {
        fileType: args.fileType,
        formData,
      });
    },
    mutationKey: getUpdateAdministrationMeetingMutationKey(meetingId),
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
export const usePrintAdministrationMeeting = (meetingId, options) => {
  const mutation = useMutation({
    mutationFn: () => printAdministrationMeeting(meetingId),
    mutationKey: getPrintAdministrationMeetingMutationKey(meetingId),
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
export const usePrintAdministrationMeetingChecklist = (meetingId, options) => {
  const mutation = useMutation({
    mutationFn: () => printAdministrationMeetingChecklist(meetingId),
    mutationKey: getPrintAdministrationMeetingChecklistMutationKey(meetingId),
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
export const usePrintAdministrationMeetingProcedures = (meetingId, options) => {
  const mutation = useMutation({
    mutationFn: () => printAdministrationMeetingProcedures(meetingId),
    mutationKey: getPrintAdministrationMeetingProceduresMutationKey(meetingId),
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
