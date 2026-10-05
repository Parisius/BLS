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

export interface AlertsPage {
  alerts: Alert[];
  /** Counted by the server across all pages, so the bell badge isn't capped at one page. */
  unreadCount: number;
  meta?: { page: number; lastPage: number; perPage: number; total: number };
}

type Json = Record<string, unknown>;

/**
 * The backend now answers with `items` + `meta` + `unread_count` (older versions returned a bare list), and
 * depending on the route those can sit under `data` or at the top level, so both are read.
 */
function parseAlerts(body: unknown): AlertsPage {
  const root = (body ?? {}) as Json;
  const data = root.data;
  const inner = (data && !Array.isArray(data) && typeof data === "object" ? data : {}) as Json;
  const list = (Array.isArray(data) ? data : (inner.items ?? root.items ?? [])) as NotificationResponse[];
  const meta = (inner.meta ?? root.meta) as Json | undefined;
  const alerts = list.map(mapAlert);
  const unread = inner.unread_count ?? root.unread_count;

  return {
    alerts,
    unreadCount: typeof unread === "number" ? unread : alerts.filter((alert) => !alert.isRead).length,
    meta: meta
      ? {
          page: Number(meta.current_page ?? meta.page ?? 1),
          lastPage: Number(meta.last_page ?? 1),
          perPage: Number(meta.per_page ?? alerts.length),
          total: Number(meta.total ?? alerts.length),
        }
      : undefined,
  };
}

export async function getAllAlerts(options?: { module?: string; isRead?: boolean; page?: number }): Promise<AlertsPage> {
  const query = {
    ...(options?.module && { type: options.module }),
    ...(options?.isRead !== undefined && { is_read: options.isRead }),
    ...(options?.page && { page: options.page }),
  };
  const { data, error } = await apiClient.GET("/notifications", { params: { query } });
  if (error) throw new Error((error as { message?: string })?.message ?? "Request to the API failed");
  return parseAlerts(data);
}

export async function markAlertAsRead(alertId: string) {
  unwrap(await apiClient.PUT("/notifications/{alertId}", { params: { path: { alertId } } }));
}
