"use server";

import { apiClient, unwrap } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";

type NotificationResponse = components["schemas"]["Notification"];

export type AlertPriority = "urgent" | "warning" | "info";

export interface Alert {
  id: string;
  title: string;
  message: string;
  priority: AlertPriority;
  isRead: boolean;
  dueDate?: string;
  /** Backend module key, e.g. "contract", "property" (mortgage), "pledge" (movable safety). */
  module: string;
  moduleId?: string;
}

const mapAlert = (item: NotificationResponse): Alert => ({
  id: item.id!,
  title: item.title ?? "",
  message: item.message ?? "",
  priority: item.priority === "urgent" || item.priority === "warning" ? item.priority : "info",
  isRead: !!item.read_at,
  dueDate: item.deadline?.slice(0, 10),
  module: item.type ?? "",
  moduleId: item.module_id ?? undefined,
});

export async function getAllAlerts(options?: { module?: string; isRead?: boolean }) {
  const query = {
    ...(options?.module && { type: options.module }),
    ...(options?.isRead !== undefined && { is_read: options.isRead }),
  };
  const raw = unwrap(await apiClient.GET("/notifications", { params: { query } }));
  return raw.map(mapAlert);
}

export async function markAlertAsRead(alertId: string) {
  unwrap(await apiClient.PUT("/notifications/{alertId}", { params: { path: { alertId } } }));
}
