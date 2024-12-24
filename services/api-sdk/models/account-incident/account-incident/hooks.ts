import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { changeTmzFromLocalToUTC } from "@/lib/utils";
import {
  createAccountIncident,
  getAllAccountIncidents,
  getOneAccountIncident,
  printAccountIncident,
} from "./requests";
/**
 * Tag for the query to fetch all incidents.
 */
export const ALL_ACCOUNT_INCIDENTS_QUERY_TAG = [
  "ACCOUNT_INCIDENTS",
  "ALL_ACCOUNT_INCIDENTS",
];
/**
 * Tag generator for the query to fetch one incident
 * @param incidentId - The id of the incident.
 * @returns The query tag.
 */
export const getOneAccountIncidentQueryTag = (incidentId) => [
  "ACCOUNT_INCIDENTS",
  "ONE_ACCOUNT_INCIDENT",
  incidentId,
];
/**
 * Tag generator for the mutation to print an incident.
 * @param incidentId - The id of the incident.
 * @returns The mutation tag.
 */
export const getPrintAccountIncidentMutationKey = (incidentId) => [
  "ACCOUNT_INCIDENTS",
  "PRINT_ACCOUNT_INCIDENT",
  incidentId,
];
/**
 * Tag for the mutation to create a incident.
 */
export const CREATE_ACCOUNT_INCIDENT_MUTATION_KEY = [
  "ACCOUNT_INCIDENTS",
  "CREATE_ACCOUNT_INCIDENT",
];
/**
 * Hook to invalidate all incidents query.
 * @returns A function to invalidate the all incidents query.
 */
export const useInvalidateAllAccountIncidents = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: ALL_ACCOUNT_INCIDENTS_QUERY_TAG,
    });
};
/**
 * Hook to invalidate the one incident query.
 * @returns A function to invalidate the one incident query.
 */
export const useInvalidateOneAccountIncident = () => {
  const queryClient = useQueryClient();
  return (incidentId) =>
    queryClient.invalidateQueries({
      queryKey: getOneAccountIncidentQueryTag(incidentId),
    });
};
/**
 * Hook to remove the one incident query.
 * @returns A function to remove the one incident query.
 */
export const useRemoveOneAccountIncidentQuery = () => {
  const queryClient = useQueryClient();
  return (incidentId) =>
    queryClient.removeQueries({
      queryKey: getOneAccountIncidentQueryTag(incidentId),
    });
};
/**
 * Hook to fetch all incidents.
 * @returns The query result.
 */
export const useAllAccountIncidents = () =>
  useQuery({
    queryKey: ALL_ACCOUNT_INCIDENTS_QUERY_TAG,
    queryFn: () => getAllAccountIncidents(),
  });
/**
 * Hook to fetch one incident.
 * @param incidentId - The id of the incident.
 * @returns The query result.
 */
export const useOneAccountIncident = (incidentId) =>
  useQuery({
    queryKey: getOneAccountIncidentQueryTag(incidentId),
    queryFn: () => getOneAccountIncident(incidentId),
  });
/**
 * Hook to create a incident.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const useCreateAccountIncident = (options = {}) => {
  const invalidateAllAccountIncidents = useInvalidateAllAccountIncidents();
  const getMutationOptions = useCallback(
    (mutateOptions) => ({
      ...mutateOptions,
      onSettled: async (...args) => {
        await invalidateAllAccountIncidents();
        return mutateOptions?.onSettled?.(...args);
      },
    }),
    [invalidateAllAccountIncidents]
  );
  const mutation = useMutation({
    mutationFn: (args) =>
      createAccountIncident({
        ...args,
        dateReceived: changeTmzFromLocalToUTC(args.dateReceived),
      }),
    mutationKey: CREATE_ACCOUNT_INCIDENT_MUTATION_KEY,
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
 * Hook to print an incident.
 * @param incidentId - The id of the incident to print.
 * @param options - The options for the mutation.
 * @returns The mutation result.
 */
export const usePrintAccountIncident = (incidentId, options = {}) => {
  const mutation = useMutation({
    mutationFn: () => printAccountIncident(incidentId),
    mutationKey: getPrintAccountIncidentMutationKey(incidentId),
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
