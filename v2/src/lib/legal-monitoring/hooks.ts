"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllJudicialItems,
  getAllLegislativeItems,
  getOneLegalItem,
  createJudicialItem,
  updateJudicialItem,
  createLegislativeItem,
  updateLegislativeItem,
  printLegalItem,
  type JudicialArgs,
  type LegislativeArgs,
} from "./items";

const ROOT = ["legalMonitoring"];
const JUDICIAL_KEY = [...ROOT, "judicial"];
const LEGISLATIVE_KEY = [...ROOT, "legislative"];
const oneKey = (itemId: string) => [...ROOT, "item", itemId];

export const useAllJudicialItems = () => useQuery({ queryKey: JUDICIAL_KEY, queryFn: getAllJudicialItems });
export const useAllLegislativeItems = () => useQuery({ queryKey: LEGISLATIVE_KEY, queryFn: getAllLegislativeItems });
export const useOneLegalItem = (itemId: string) =>
  useQuery({ queryKey: oneKey(itemId), queryFn: () => getOneLegalItem(itemId) });

export const useCreateJudicialItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: JudicialArgs) => createJudicialItem(args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: JUDICIAL_KEY }),
  });
};

export const useUpdateJudicialItem = (itemId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: JudicialArgs) => updateJudicialItem(itemId, args),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: oneKey(itemId) });
      return queryClient.invalidateQueries({ queryKey: JUDICIAL_KEY });
    },
  });
};

export const useCreateLegislativeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: LegislativeArgs) => createLegislativeItem(args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: LEGISLATIVE_KEY }),
  });
};

export const useUpdateLegislativeItem = (itemId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: LegislativeArgs) => updateLegislativeItem(itemId, args),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: oneKey(itemId) });
      return queryClient.invalidateQueries({ queryKey: LEGISLATIVE_KEY });
    },
  });
};

export const usePrintLegalItem = () => useMutation({ mutationFn: printLegalItem });
