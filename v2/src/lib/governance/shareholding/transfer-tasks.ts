"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import { toBackendDate } from "@/lib/shared/date-utils";
import { mapWorkflowTask, type ForwardWorkflowTaskArgs, type WorkflowTask } from "@/lib/shared/workflow-task";

export type TransferTask = WorkflowTask;

export async function getAllTransferTasks(transferId: string) {
  const data = unwrap(
    await apiClient.GET("/task_action_transfers", { params: { query: { action_transfer_id: transferId } } }),
  );
  return data.map(mapWorkflowTask);
}

/**
 * The form is server-defined (`task.form.fields`), so the client builds the
 * multipart body (text/select/radio/date as plain fields, files as
 * `name[i][file]` / `name[i][name]`) and this action only adds the task id.
 */
export async function completeTransferTask(taskId: string, formData: FormData) {
  formData.set("task_action_transfer_id", taskId);
  const { error } = await apiClient.POST("/complete_task_action_transfers", { body: formData as never });
  throwIfError(error, "Failed to complete the task");
}

export async function forwardTransferTask(taskId: string, args: ForwardWorkflowTaskArgs) {
  const { error } = await apiClient.POST("/complete_task_action_transfers", {
    params: { query: { task_action_transfer_id: taskId } },
    body: {
      forward_title: args.title,
      deadline_transfer: toBackendDate(args.dueDate),
      description: args.description,
      collaborators: [args.receiverId],
    },
  });
  throwIfError(error, "Failed to forward the task");
}
