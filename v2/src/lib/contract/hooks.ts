"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllContractCategories,
  getAllContractCategoryTypes,
  getAllContractCategorySubTypes,
} from "./categories";
import { getAllStakeholders, createStakeholder } from "./stakeholders";
import {
  getAllContracts,
  getOneContract,
  createContract,
  updateContract,
  forwardContract,
  planContractDates,
  completeContract,
  deleteContract,
  printContract,
} from "./contracts";
import {
  getAllContractEvents,
  createContractEvent,
  updateContractEvent,
  markContractEventAsCompleted,
  forwardContractEvent,
  deleteContractEvent,
} from "./events";
import { getAllContractModels, createContractModel, deleteContractModel } from "./models";

// ---- categories ----

export const useAllContractCategories = () =>
  useQuery({ queryKey: ["contract", "categories"], queryFn: getAllContractCategories });

export const useAllContractCategoryTypes = (categoryId?: string) =>
  useQuery({
    queryKey: ["contract", "categoryTypes", categoryId],
    queryFn: () => getAllContractCategoryTypes(categoryId!),
    enabled: !!categoryId,
  });

export const useAllContractCategorySubTypes = (categoryTypeId?: string) =>
  useQuery({
    queryKey: ["contract", "categorySubTypes", categoryTypeId],
    queryFn: () => getAllContractCategorySubTypes(categoryTypeId!),
    enabled: !!categoryTypeId,
  });

// ---- stakeholders ----

const STAKEHOLDERS_KEY = ["contract", "stakeholders"];

export const useAllStakeholders = () =>
  useQuery({ queryKey: STAKEHOLDERS_KEY, queryFn: getAllStakeholders });

export const useCreateStakeholder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStakeholder,
    onSettled: () => queryClient.invalidateQueries({ queryKey: STAKEHOLDERS_KEY }),
  });
};

// ---- users (for forward recipients) ----
export { useAllUsers as useAllContractUsers } from "@/lib/administration/hooks";

// ---- contracts ----

const CONTRACTS_KEY = ["contract", "contracts"];
const oneContractKey = (contractId: string) => ["contract", "contracts", contractId];

export const useAllContracts = () =>
  useQuery({ queryKey: CONTRACTS_KEY, queryFn: getAllContracts });

export const useOneContract = (contractId: string) =>
  useQuery({ queryKey: oneContractKey(contractId), queryFn: () => getOneContract(contractId) });

export const useCreateContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createContract,
    onSettled: () => queryClient.invalidateQueries({ queryKey: CONTRACTS_KEY }),
  });
};

export const useUpdateContract = (contractId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof updateContract>[1]) => updateContract(contractId, args),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: oneContractKey(contractId) });
      return queryClient.invalidateQueries({ queryKey: CONTRACTS_KEY });
    },
  });
};

export const useForwardContract = (contractId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof forwardContract>[1]) => forwardContract(contractId, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: oneContractKey(contractId) }),
  });
};

export const usePlanContractDates = (contractId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof planContractDates>[1]) =>
      planContractDates(contractId, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: oneContractKey(contractId) }),
  });
};

export const useCompleteContract = (contractId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof completeContract>[1]) => completeContract(contractId, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: oneContractKey(contractId) }),
  });
};

export const useDeleteContract = (contractId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteContract(contractId),
    onSuccess: () => {
      // The deleted contract's own query would otherwise refetch a 404 while its page is still mounted.
      queryClient.removeQueries({ queryKey: oneContractKey(contractId) });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CONTRACTS_KEY, exact: true }),
  });
};

export const usePrintContract = (contractId: string) =>
  useMutation({ mutationFn: () => printContract(contractId) });

// ---- contract events ----

const eventsKey = (contractId: string) => ["contract", "events", contractId];

export const useAllContractEvents = (contractId: string) =>
  useQuery({ queryKey: eventsKey(contractId), queryFn: () => getAllContractEvents(contractId) });

export const useCreateContractEvent = (contractId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof createContractEvent>[1]) =>
      createContractEvent(contractId, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: eventsKey(contractId) }),
  });
};

export const useUpdateContractEvent = (contractId: string, eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof updateContractEvent>[1]) =>
      updateContractEvent(eventId, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: eventsKey(contractId) }),
  });
};

export const useMarkContractEventAsCompleted = (contractId: string, eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markContractEventAsCompleted(eventId),
    onSettled: () => queryClient.invalidateQueries({ queryKey: eventsKey(contractId) }),
  });
};

export const useForwardContractEvent = (contractId: string, eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof forwardContractEvent>[1]) =>
      forwardContractEvent(eventId, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: eventsKey(contractId) }),
  });
};

export const useDeleteContractEvent = (contractId: string, eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteContractEvent(eventId),
    onSettled: () => queryClient.invalidateQueries({ queryKey: eventsKey(contractId) }),
  });
};

// ---- contract models ----

const modelsKey = (parentId?: string) => ["contract", "models", parentId ?? "root"];

export const useAllContractModels = (parentId?: string) =>
  useQuery({ queryKey: modelsKey(parentId), queryFn: () => getAllContractModels(parentId) });

export const useCreateContractModel = (parentId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createContractModel,
    // Fixed vs. the original app: it invalidated the *root* models list here
    // regardless of which folder the model was created in (it called
    // useCreateContractModel() with no parentId, only passing parentId inside
    // the mutate payload) — a new sub-folder's contents could go stale.
    onSettled: () => queryClient.invalidateQueries({ queryKey: modelsKey(parentId) }),
  });
};

export const useDeleteContractModel = (parentId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteContractModel,
    onSettled: () => queryClient.invalidateQueries({ queryKey: modelsKey(parentId) }),
  });
};
