"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import { toBackendDate } from "@/lib/shared/date-utils";
import { forwardVerified, mapWorkflowTask, type ForwardWorkflowTaskArgs, type WorkflowTask } from "@/lib/shared/workflow-task";

export type RecoveryStep = WorkflowTask;

export async function getAllRecoverySteps(recoveryId: string) {
  const data = unwrap(await apiClient.GET("/recovery/tasks", { params: { query: { id: recoveryId } } }));
  return data.map(mapWorkflowTask);
}

export interface RecoveryStepArgs {
  title: string;
  dueDate: string;
}

export async function createRecoveryStep(recoveryId: string, args: RecoveryStepArgs) {
  unwrap(
    await apiClient.POST("/recovery/tasks", {
      body: { model_id: recoveryId, title: args.title, deadline: toBackendDate(args.dueDate) },
    }),
  );
}

export async function updateRecoveryStep(stepId: string, args: RecoveryStepArgs) {
  unwrap(
    await apiClient.PUT("/recovery/tasks/{stepId}", {
      params: { path: { stepId } },
      body: { title: args.title, deadline: toBackendDate(args.dueDate) },
    }),
  );
}

/** Steps without a form are finished with an empty request; the others send the server-defined form's multipart body. */
export async function completeRecoveryStep(stepId: string, formData: FormData) {
  const hasBody = [...formData.keys()].length > 0;
  const { error } = await apiClient.POST("/recovery/tasks/complete/{stepId}", {
    params: { path: { stepId } },
    ...(hasBody ? { body: formData as never } : {}),
  });
  throwIfError(error, "Failed to complete the recovery step");
}

export async function forwardRecoveryStep(recoveryId: string, stepId: string, args: ForwardWorkflowTaskArgs) {
  await forwardVerified(() => getAllRecoverySteps(recoveryId), stepId, async () => {
    const { error } = await apiClient.PUT("/recovery/tasks/transfer/{stepId}", {
      params: { path: { stepId } },
      body: {
        forward_title: args.title,
        deadline_transfer: toBackendDate(args.dueDate),
        description: args.description,
        collaborators: [args.receiverId],
      },
    });
    throwIfError(error, "Failed to forward the recovery step");
  });
}

export async function deleteRecoveryStep(stepId: string) {
  const { error } = await apiClient.DELETE("/recovery/tasks/{stepId}", { params: { path: { stepId } } });
  throwIfError(error, "Failed to delete the recovery step");
}
