"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import { toBackendDate } from "@/lib/shared/date-utils";
import type { components } from "@/lib/api/schema";

type TaskResponse = components["schemas"]["TaskManagementCommittee"];

export type MeetingTaskType = "task" | "checklist" | "procedure";

export interface MeetingTask {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  assignee?: string;
  supervisor?: string;
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

function mapTask(item: TaskResponse): MeetingTask {
  return {
    id: item.id!,
    title: item.libelle ?? "",
    dueDate: item.deadline ?? "",
    completed: !!item.status,
    assignee: item.responsible,
    supervisor: item.supervisor,
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

export async function getAllMeetingTasks(meetingId: string, type: MeetingTaskType = "task") {
  const data = unwrap(
    await apiClient.GET("/task_management_committees", {
      // Checklist/procedure tasks are invisible unless `type` is passed
      // explicitly; a plain fetch only returns the regular timeline's own
      // (backend-defaulted) task type — see general-meeting/tasks.ts.
      params: { query: { management_committee_id: meetingId, type: type === "task" ? undefined : type } },
    }),
  );
  return data
    .map(mapTask)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export interface MeetingTaskFormArgs {
  title: string;
  dueDate: string;
  assignee?: string;
  supervisor?: string;
}

export async function createMeetingTask(
  meetingId: string,
  args: MeetingTaskFormArgs,
  type: MeetingTaskType = "task",
) {
  const data = unwrap(
    await apiClient.POST("/task_management_committees", {
      body: {
        management_committee_id: meetingId,
        libelle: args.title,
        deadline: toBackendDate(args.dueDate),
        responsible: args.assignee || undefined,
        supervisor: args.supervisor || undefined,
        type: type === "task" ? undefined : type,
      },
    }),
  );
  return mapTask(data);
}

export async function updateMeetingTask(taskId: string, args: MeetingTaskFormArgs) {
  const data = unwrap(
    await apiClient.PUT("/task_management_committees/{taskId}", {
      params: { path: { taskId } },
      body: {
        libelle: args.title,
        deadline: toBackendDate(args.dueDate),
        responsible: args.assignee || undefined,
        supervisor: args.supervisor || undefined,
      },
    }),
  );
  return mapTask(data);
}

export async function markMeetingTaskAsCompleted(taskId: string) {
  const data = unwrap(
    await apiClient.PUT("/task_management_committees/{taskId}", {
      params: { path: { taskId } },
      body: { status: true },
    }),
  );
  return mapTask(data);
}

export interface ForwardMeetingTaskArgs {
  title: string;
  dueDate: string;
  receiverId: string;
  description: string;
}

export async function forwardMeetingTask(taskId: string, args: ForwardMeetingTaskArgs) {
  const data = unwrap(
    await apiClient.PUT("/task_management_committees/{taskId}", {
      params: { path: { taskId } },
      body: {
        forward_title: args.title,
        deadline_transfer: toBackendDate(args.dueDate),
        description: args.description,
        collaborators: [args.receiverId],
      },
    }),
  );
  return mapTask(data);
}

export async function deleteMeetingTask(taskId: string) {
  const { error } = await apiClient.DELETE("/task_management_committees/{taskId}", {
    params: { path: { taskId } },
  });
  throwIfError(error, "Failed to delete the task");
}

export async function updateChecklistTasksStatus(tasks: { id: string; status: boolean }[]) {
  const { error } = await apiClient.PUT("/update_status_task_management_committees", {
    body: { tasks: tasks as never },
  });
  throwIfError(error, "Failed to update the task list");
}
