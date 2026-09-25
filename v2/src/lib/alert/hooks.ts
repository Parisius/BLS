"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllAlerts, markAlertAsRead } from "./alerts";

const ALERTS_KEY = ["alerts"];

export const useAllAlerts = (options?: { module?: string; isRead?: boolean }) =>
  useQuery({ queryKey: [...ALERTS_KEY, options?.module ?? "all", options?.isRead ?? "any"], queryFn: () => getAllAlerts(options) });

export const useMarkAlertAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAlertAsRead,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ALERTS_KEY }),
  });
};
