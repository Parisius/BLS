"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllBankItems, createBankItem, updateBankItem, deleteBankItem } from "./items";
import type { BankKind } from "./kinds";

const listKey = (kind: BankKind) => ["textsBank", kind];

export const useAllBankItems = (kind: BankKind) =>
  useQuery({ queryKey: listKey(kind), queryFn: () => getAllBankItems(kind) });

export const useCreateBankItem = (kind: BankKind) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createBankItem(kind, formData),
    onSettled: () => queryClient.invalidateQueries({ queryKey: listKey(kind) }),
  });
};

export const useUpdateBankItem = (kind: BankKind) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, formData }: { itemId: string; formData: FormData }) => updateBankItem(itemId, formData),
    onSettled: () => queryClient.invalidateQueries({ queryKey: listKey(kind) }),
  });
};

export const useDeleteBankItem = (kind: BankKind) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBankItem,
    onSettled: () => queryClient.invalidateQueries({ queryKey: listKey(kind) }),
  });
};
