"use server";

import { apiClient, unwrap, throwIfError, toResult } from "@/lib/api/client";
import type { ActionResult } from "@/lib/api/result";
import { toBackendDate } from "@/lib/shared/date-utils";
import { mapWorkflowTask, type ForwardWorkflowTaskArgs, type WorkflowTask } from "@/lib/shared/workflow-task";

export async function getAllIncidentTasks(incidentId: string) {
  const data = unwrap(
    await apiClient.GET("/task_incidents", { params: { query: { incident_id: incidentId } } }),
  );
  return data.map(mapWorkflowTask);
}

/** The client builds the server-defined form's multipart body; this adds the ids the endpoint needs. */
export async function completeIncidentTask(taskId: string, formData: FormData) {
  formData.set("task_incident_id", taskId);
  formData.set("status", "1");
  const { error } = await apiClient.POST("/complete_task_incidents", { body: formData as never });
  throwIfError(error, "Failed to complete the task");
}

/**
 * Forwarding has its own endpoint (`complete_task_incidents` validates every request as a completion and
 * rejects a forward). The body mirrors the fields the old route took; the guide does not spell them out.
 */
export async function forwardIncidentTask(task: WorkflowTask, args: ForwardWorkflowTaskArgs): Promise<ActionResult> {
  const result = await apiClient.POST("/task_incidents/{taskIncident}/transfer", {
    params: { path: { taskIncident: task.id } },
    body: {
      forward_title: args.title,
      deadline_transfer: toBackendDate(args.dueDate),
      description: args.description,
      collaborators: [args.receiverId],
    },
  });
  return toResult(result, "Failed to forward the task");
}
