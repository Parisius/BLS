"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import { toBackendDate } from "@/lib/shared/date-utils";
import { mapWorkflowTask, type ForwardWorkflowTaskArgs } from "@/lib/shared/workflow-task";

export async function getAllLitigationTasks(litigationId: string) {
  const data = unwrap(await apiClient.GET("/litigation/tasks", { params: { query: { id: litigationId } } }));
  return data.map(mapWorkflowTask);
}

export interface LitigationTaskArgs {
  title: string;
  dueDate: string;
}

export async function createLitigationTask(litigationId: string, args: LitigationTaskArgs) {
  unwrap(
    await apiClient.POST("/litigation/tasks", {
      body: { model_id: litigationId, title: args.title, deadline: toBackendDate(args.dueDate) },
    }),
  );
}

export async function updateLitigationTask(taskId: string, args: LitigationTaskArgs) {
  unwrap(
    await apiClient.PUT("/litigation/tasks/{taskId}", {
      params: { path: { taskId } },
      body: { title: args.title, deadline: toBackendDate(args.dueDate) },
    }),
  );
}

/**
 * Tasks without a form are finished with an empty request; the others send the server-defined form's multipart body.
 * Like the safety workflow, the backend may error after actually completing the task, so on error the task list is
 * re-read and a task that is now completed counts as success.
 */
export async function completeLitigationTask(litigationId: string, taskId: string, formData: FormData) {
  const hasBody = [...formData.keys()].length > 0;
  const { error } = await apiClient.POST("/litigation/tasks/complete/{taskId}", {
    params: { path: { taskId } },
    ...(hasBody ? { body: formData as never } : {}),
  });
  if (!error) return;

  const tasks = await getAllLitigationTasks(litigationId);
  if (tasks.find((task) => task.id === taskId)?.completed) return;
  throwIfError(error, "Failed to complete the task");
}

export async function forwardLitigationTask(taskId: string, args: ForwardWorkflowTaskArgs) {
  const { error } = await apiClient.PUT("/litigation/tasks/transfer/{taskId}", {
    params: { path: { taskId } },
    body: {
      forward_title: args.title,
      deadline_transfer: toBackendDate(args.dueDate),
      description: args.description,
      collaborators: [args.receiverId],
    },
  });
  throwIfError(error, "Failed to forward the task");
}

export async function deleteLitigationTask(taskId: string) {
  const { error } = await apiClient.DELETE("/litigation/tasks/{taskId}", { params: { path: { taskId } } });
  throwIfError(error, "Failed to delete the task");
}
