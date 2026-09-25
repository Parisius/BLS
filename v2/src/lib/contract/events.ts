"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import { toBackendDate } from "@/lib/shared/date-utils";
import type { components } from "@/lib/api/schema";

type TaskResponse = components["schemas"]["Task"];

export interface ContractEvent {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  createdBy?: string;
  forwards: {
    id: string;
    title: string;
    dueDate: string;
    description: string;
    sender: { id: string; firstname: string; lastname: string; email: string };
    receiver: { id: string; firstname: string; lastname: string; email: string };
  }[];
}

function mapEvent(item: TaskResponse): ContractEvent {
  return {
    id: item.id!,
    title: item.libelle ?? "",
    dueDate: item.deadline ?? "",
    completed: !!item.status,
    createdBy: item.created_by,
    forwards: (item.transfers as {
      id?: string;
      title?: string;
      deadline?: string;
      description?: string;
      sender?: { id?: string; firstname?: string; lastname?: string; email?: string };
      collaborators?: { id?: string; firstname?: string; lastname?: string; email?: string }[];
    }[] ?? []).map((transfer) => ({
      id: transfer.id!,
      title: transfer.title ?? "",
      dueDate: transfer.deadline ?? "",
      description: transfer.description ?? "",
      sender: {
        id: transfer.sender?.id ?? "",
        firstname: transfer.sender?.firstname ?? "",
        lastname: transfer.sender?.lastname ?? "",
        email: transfer.sender?.email ?? "",
      },
      receiver: {
        id: transfer.collaborators?.[0]?.id ?? "",
        firstname: transfer.collaborators?.[0]?.firstname ?? "",
        lastname: transfer.collaborators?.[0]?.lastname ?? "",
        email: transfer.collaborators?.[0]?.email ?? "",
      },
    })),
  };
}

export async function getAllContractEvents(contractId: string) {
  const data = unwrap(
    await apiClient.GET("/tasks", { params: { query: { contract_id: String(contractId) } } }),
  );
  return data
    .map(mapEvent)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export interface ContractEventFormArgs {
  title: string;
  dueDate: string;
}

export async function createContractEvent(contractId: string, args: ContractEventFormArgs) {
  const data = unwrap(
    await apiClient.POST("/tasks", {
      body: { contract_id: contractId, libelle: args.title, deadline: toBackendDate(args.dueDate) },
    }),
  );
  return mapEvent(data);
}

export async function updateContractEvent(eventId: string, args: ContractEventFormArgs) {
  const data = unwrap(
    await apiClient.PUT("/tasks/{eventId}", {
      params: { path: { eventId } },
      body: { libelle: args.title, deadline: toBackendDate(args.dueDate) },
    }),
  );
  return mapEvent(data);
}

export async function markContractEventAsCompleted(eventId: string) {
  const data = unwrap(
    await apiClient.PUT("/tasks/{eventId}", {
      params: { path: { eventId } },
      body: { status: true },
    }),
  );
  return mapEvent(data);
}

export interface ForwardContractEventArgs {
  title: string;
  dueDate: string;
  receiverId: string;
  description: string;
}

export async function forwardContractEvent(eventId: string, args: ForwardContractEventArgs) {
  const data = unwrap(
    await apiClient.PUT("/tasks/{eventId}", {
      params: { path: { eventId } },
      body: {
        forward_title: args.title,
        deadline_transfer: toBackendDate(args.dueDate),
        description: args.description,
        collaborators: [args.receiverId],
      },
    }),
  );
  return mapEvent(data);
}

export async function deleteContractEvent(eventId: string) {
  const { error } = await apiClient.DELETE("/tasks/{eventId}", { params: { path: { eventId } } });
  throwIfError(error, "Failed to delete the contract event");
}
