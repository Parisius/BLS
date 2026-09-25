"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
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
 * Known backend defect: this endpoint validates every request as a task completion (it requires `type`
 * and `documents`), so forwarding is rejected with the original app's payload.
 */
export async function forwardIncidentTask(task: WorkflowTask, args: ForwardWorkflowTaskArgs) {
  const { error } = await apiClient.POST("/complete_task_incidents", {
    params: { query: { task_incident_id: task.id } },
    body: {
      forward_title: args.title,
      deadline_transfer: toBackendDate(args.dueDate),
      description: args.description,
      collaborators: [args.receiverId],
    },
  });
  throwIfError(error, "Failed to forward the task");
}
