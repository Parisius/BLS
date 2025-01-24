import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { changeTmzFromLocalToUTC } from "@/lib/utils";
// eslint-disable-next-line import/no-cycle
import {
  printManagementCommittee,
  printManagementCommitteeChecklist,
  printManagementCommitteeProcedures,
  useInvalidateAllMeetingTasks,
} from "@/services/api-sdk/models/management-committee";
import {
  addManagementCommitteeFile,
  createManagementCommittee,
  getArchivedManagementCommittees,
  getCurrentManagementCommittee,
  getOneManagementCommittee,
  updateManagementCommittee,
} from "./requests";
/**
 * Tag for the query to fetch all management committees
 */
export const ARCHIVED_MANAGEMENT_COMMITTEES_QUERY_KEY = [
  "MANAGEMENT_COMMITTEES/ARCHIVED_MANAGEMENT_COMMITTEES",
];
/**
 * Tag for the query to fetch the current management committee
 */
export const CURRENT_MANAGEMENT_COMMITTEE_QUERY_KEY = [
  "MANAGEMENT_COMMITTEES/CURRENT_MANAGEMENT_COMMITTEE",
];
/**
 * Tag generator for the query to fetch one management committee
 */
export const getOneManagementCommitteeQueryKey = (id) => [
  "MANAGEMENT_COMMITTEES/ONE_MANAGEMENT_COMMITTEE",
  id,
];
/**
 * Tag for the mutation to create a management committee.
 */
export const CREATE_MANAGEMENT_COMMITTEE_MUTATION_KEY = [
  "MANAGEMENT_COMMITTEES/CREATE_MANAGEMENT_COMMITTEE",
];
/**
 * Tag generator for the mutation to update a management committee.
 * @param id - The id of the management committee to update.
 * @returns The mutation key.
 */
export const getUpdateManagementCommitteeMutationKey = (id) => [
  "MANAGEMENT_COMMITTEES/UPDATE_MANAGEMENT_COMMITTEE",
  id,
];
/**
 * Tag generator for the mutation to print a meeting.
 * @param meetingId - The id of the meeting.
 * @returns The mutation tag.
 */
export const getPrintManagementCommitteeMutationKey = (meetingId) => [
  "MANAGEMENT_COMMITTEE",
  "PRINT_MANAGEMENT_COMMITTEE",
  meetingId,
];
/**
 * Tag generator for the mutation to print a meeting checklist.
 * @param meetingId - The id of the meeting.
 * @returns The mutation tag.
 */
export const getPrintManagementCommitteeChecklistMutationKey = (meetingId) => [
  "MANAGEMENT_COMMITTEE",
  "PRINT_MANAGEMENT_COMMITTEE_CHECKLIST",
  meetingId,
];
/**
 * Tag generator for the mutation to print a meeting procedures.
 * @param meetingId - The id of the meeting.
 * @returns The mutation tag.
 */
export const getPrintManagementCommitteeProceduresMutationKey = (meetingId) => [
  "MANAGEMENT_COMMITTEE",
  "PRINT_MANAGEMENT_COMMITTEE_PROCEDURES",
  meetingId,
];
/**
 * Hook to invalidate the current management committee query.
 * @returns A function to invalidate the current management committee query.
 */
export const useCurrentManagementCommitteeInvalidate = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: CURRENT_MANAGEMENT_COMMITTEE_QUERY_KEY,
    });
};
/**
 * Hook to invalidate the one management committee query.
 * @returns A function to invalidate the one management committee query.
 */
export const useOneManagementCommitteeInvalidate = () => {
  const queryClient = useQueryClient();
  return (meetingId) =>
    queryClient.invalidateQueries({
      queryKey: getOneManagementCommitteeQueryKey(meetingId),
    });
};
/**
 * Hook to fetch archived management committees.
 * @returns The query result.
 */
export const useArchivedManagementCommittees = () =>
  useQuery({
    queryKey: ARCHIVED_MANAGEMENT_COMMITTEES_QUERY_KEY,
    queryFn: () => getArchivedManagementCommittees(),
  });
/**
 * Hook to fetch the current management committee.
 * @returns The query result.
 */
export const useCurrentManagementCommittee = () =>
  useQuery({
    queryKey: CURRENT_MANAGEMENT_COMMITTEE_QUERY_KEY,
    queryFn: () => getCurrentManagementCommittee(),
  });
/**
 * Hook to fetch a management committee by its id.
 * @param id
 * @returns The query result.
 */
export const useOneManagementCommittee = (id) =>
  useQuery({
    queryKey: getOneManagementCommitteeQueryKey(id),
    queryFn: () => getOneManagementCommittee(id),
  });
/**
 * Hook to create a management committee.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateManagementCommittee = (options = {}) => {
  const invalidateCurrentManagementCommittee =
    useCurrentManagementCommitteeInvalidate();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateCurrentManagementCommittee();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateCurrentManagementCommittee]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      createManagementCommittee({
        ...args,
        meetingDate: changeTmzFromLocalToUTC(args.meetingDate),
      }),
    mutationKey: CREATE_MANAGEMENT_COMMITTEE_MUTATION_KEY,
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
 * Hook to update a management committee.
 * @param meetingId - The id of the management committee to update.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useUpdateManagementCommittee = (meetingId, options) => {
  const invalidateOneManagementCommittee =
    useOneManagementCommitteeInvalidate();
  const invalidateAllMeetingTasks = useInvalidateAllMeetingTasks(meetingId);
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneManagementCommittee(meetingId);
        await invalidateAllMeetingTasks();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllMeetingTasks, invalidateOneManagementCommittee, meetingId]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      updateManagementCommittee(meetingId, {
        ...args,
        meetingDate:
          args.meetingDate && changeTmzFromLocalToUTC(args.meetingDate),
      }),
    mutationKey: getUpdateManagementCommitteeMutationKey(meetingId),
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
 * Hook to add a file to a management committee.
 * @param meetingId - The id of the management committee.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useAddManagementCommitteeFile = (meetingId, options = {}) => {
  const invalidateOneManagementCommittee =
    useOneManagementCommitteeInvalidate();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateOneManagementCommittee(meetingId);
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateOneManagementCommittee, meetingId]
  );
  const mutation = useMutation({
    mutationFn: (args) => {
      const formData = new FormData();
      formData.set("file", args.file);
      return addManagementCommitteeFile(meetingId, {
        fileType: args.fileType,
        formData,
      });
    },
    mutationKey: getUpdateManagementCommitteeMutationKey(meetingId),
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
export const usePrintManagementCommittee = (meetingId, options) => {
  const mutation = useMutation({
    mutationFn: () => printManagementCommittee(meetingId),
    mutationKey: getPrintManagementCommitteeMutationKey(meetingId),
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
export const usePrintManagementCommitteeChecklist = (meetingId, options) => {
  const mutation = useMutation({
    mutationFn: () => printManagementCommitteeChecklist(meetingId),
    mutationKey: getPrintManagementCommitteeChecklistMutationKey(meetingId),
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
export const usePrintManagementCommitteeProcedures = (meetingId, options) => {
  const mutation = useMutation({
    mutationFn: () => printManagementCommitteeProcedures(meetingId),
    mutationKey: getPrintManagementCommitteeProceduresMutationKey(meetingId),
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
