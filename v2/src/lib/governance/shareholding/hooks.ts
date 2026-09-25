"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBankInfos, updateBankInfos, createBankCapital } from "./bank";
import {
  getAllShareholders,
  createShareholder,
  updateShareholder,
  deleteShareholder,
  printSharesCertificate,
  type ShareholderFormArgs,
} from "./shareholders";
import { getAllThirdParties } from "./third-parties";
import { getAllTransfers, getOneTransfer, transferShares, approveTransfer } from "./transfers";
import { getAllTransferTasks, completeTransferTask, forwardTransferTask } from "./transfer-tasks";
import type { ForwardWorkflowTaskArgs } from "@/lib/shared/workflow-task";

export { useAllUsers as useAllTransferUsers } from "@/lib/administration/hooks";

const ROOT = ["governance", "shareholding"];
const BANK_KEY = [...ROOT, "bank"];
const SHAREHOLDERS_KEY = [...ROOT, "shareholders"];
const THIRD_PARTIES_KEY = [...ROOT, "thirdParties"];
const TRANSFERS_KEY = [...ROOT, "transfers"];
const oneTransferKey = (transferId: string) => [...TRANSFERS_KEY, transferId];
const tasksKey = (transferId: string) => [...ROOT, "tasks", transferId];

// ---- bank ----

export const useBankInfos = () => useQuery({ queryKey: BANK_KEY, queryFn: getBankInfos });

export const useUpdateBankInfos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBankInfos,
    onSettled: () => queryClient.invalidateQueries({ queryKey: BANK_KEY }),
  });
};

export const useCreateBankCapital = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBankCapital,
    onSettled: () => queryClient.invalidateQueries({ queryKey: BANK_KEY }),
  });
};

// ---- shareholders ----

/** Anything that changes the cap table also changes the bank card (count, majority shareholder). */
function invalidateCapTable(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: BANK_KEY });
  return queryClient.invalidateQueries({ queryKey: SHAREHOLDERS_KEY });
}

export const useAllShareholders = () =>
  useQuery({ queryKey: SHAREHOLDERS_KEY, queryFn: getAllShareholders });

export const useCreateShareholder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createShareholder,
    onSettled: () => invalidateCapTable(queryClient),
  });
};

export const useUpdateShareholder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ shareholderId, ...args }: { shareholderId: string } & ShareholderFormArgs) =>
      updateShareholder(shareholderId, args),
    onSettled: () => invalidateCapTable(queryClient),
  });
};

export const useDeleteShareholder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteShareholder,
    onSettled: () => invalidateCapTable(queryClient),
  });
};

export const usePrintSharesCertificate = () =>
  useMutation({ mutationFn: printSharesCertificate });

// ---- third parties ----

export const useAllThirdParties = () =>
  useQuery({ queryKey: THIRD_PARTIES_KEY, queryFn: getAllThirdParties });

// ---- transfers ----

export const useAllTransfers = () => useQuery({ queryKey: TRANSFERS_KEY, queryFn: getAllTransfers });

export const useOneTransfer = (transferId: string) =>
  useQuery({ queryKey: oneTransferKey(transferId), queryFn: () => getOneTransfer(transferId) });

export const useTransferShares = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transferShares,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: THIRD_PARTIES_KEY });
      return queryClient.invalidateQueries({ queryKey: TRANSFERS_KEY });
    },
  });
};

export const useApproveTransfer = (transferId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof approveTransfer>[1]) => approveTransfer(transferId, args),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TRANSFERS_KEY });
      queryClient.invalidateQueries({ queryKey: THIRD_PARTIES_KEY });
      return invalidateCapTable(queryClient);
    },
  });
};

// ---- transfer tasks ----

export const useAllTransferTasks = (transferId: string) =>
  useQuery({ queryKey: tasksKey(transferId), queryFn: () => getAllTransferTasks(transferId) });

export const useCompleteTransferTask = (transferId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, formData }: { taskId: string; formData: FormData }) =>
      completeTransferTask(taskId, formData),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TRANSFERS_KEY });
      return queryClient.invalidateQueries({ queryKey: tasksKey(transferId) });
    },
  });
};

export const useForwardTransferTask = (transferId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, args }: { taskId: string; args: ForwardWorkflowTaskArgs }) =>
      forwardTransferTask(taskId, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: tasksKey(transferId) }),
  });
};
