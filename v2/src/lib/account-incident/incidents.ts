"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import { toBackendDate } from "@/lib/shared/date-utils";
import type { components } from "@/lib/api/schema";

type IncidentResponse = components["schemas"]["Incident"];

export interface Incident {
  id: string;
  title: string;
  reference?: string;
  dateReceived: string;
  completed: boolean;
  isClient: boolean;
  category: { value: string; label: string };
  author: { id: string; name: string; email?: string; phone?: string };
  currentTask?: { id: string; title: string; code?: string };
  files: { fileUrl: string; filename: string }[];
}

function mapIncident(item: IncidentResponse): Incident {
  return {
    id: item.id!,
    title: item.title ?? "",
    reference: item.reference,
    dateReceived: item.date_received ?? "",
    completed: !!item.status,
    isClient: !!item.client,
    category: { value: item.category?.value ?? "", label: item.category?.label ?? "" },
    author: {
      id: item.author_incident?.id ?? "",
      name: item.author_incident?.name ?? "",
      email: item.author_incident?.email,
      phone: item.author_incident?.telephone,
    },
    currentTask: item.current_task?.id
      ? { id: item.current_task.id, title: item.current_task.title ?? "", code: item.current_task.code }
      : undefined,
    files: (item.files ?? []).map((file) => ({ fileUrl: file.file_url ?? "", filename: file.filename ?? "" })),
  };
}

export async function getAllIncidents() {
  const data = unwrap(await apiClient.GET("/incidents"));
  return data.map(mapIncident);
}

export async function getOneIncident(incidentId: string) {
  const data = unwrap(await apiClient.GET("/incidents/{incidentId}", { params: { path: { incidentId } } }));
  return mapIncident(data);
}

export interface CreateIncidentArgs {
  title: string;
  dateReceived: string;
  isClient: boolean;
  category: string;
  authorId: string;
}

export async function createIncident(args: CreateIncidentArgs) {
  const data = unwrap(
    await apiClient.POST("/incidents", {
      body: {
        title: args.title,
        date_received: toBackendDate(args.dateReceived),
        client: args.isClient,
        type: args.category,
        author_incident_id: args.authorId,
      },
    }),
  );
  return mapIncident(data);
}

export async function printIncident(incidentId: string) {
  const { data, error, response } = await apiClient.GET("/generate_pdf_fiche_suivi_incident", {
    params: { query: { incident_id: incidentId } },
    parseAs: "arrayBuffer",
  });
  throwIfError(error, "Failed to print the incident");
  if (!data) throw new Error("Failed to print the incident");
  const filename = response.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ?? "incident.pdf";
  return { bytes: Array.from(new Uint8Array(data as ArrayBuffer)), filename };
}
