"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import { toBackendDate } from "@/lib/shared/date-utils";
import { mapWorkflowTask, type ForwardWorkflowTaskArgs } from "@/lib/shared/workflow-task";

export async function getAllSafetySteps(guaranteeId: string) {
  const data = unwrap(await apiClient.GET("/guarantees/tasks", { params: { query: { id: guaranteeId } } }));
  return data.map(mapWorkflowTask);
}

export interface SafetyStepArgs {
  title: string;
  dueDate: string;
}

export async function createSafetyStep(guaranteeId: string, args: SafetyStepArgs) {
  unwrap(
    await apiClient.POST("/guarantees/tasks", {
      body: { model_id: guaranteeId, title: args.title, deadline: toBackendDate(args.dueDate) },
    }),
  );
}

export async function updateSafetyStep(stepId: string, args: SafetyStepArgs) {
  unwrap(
    await apiClient.PUT("/guarantees/tasks/{stepId}", {
      params: { path: { stepId } },
      body: { title: args.title, deadline: toBackendDate(args.dueDate) },
    }),
  );
}

/**
 * Steps without a form are finished with an empty request; the others send the server-defined form's multipart body.
 *
 * Backend quirk: completing a step does the work and then can fail with a generic error while building the response
 * (the step is completed anyway). So on error we re-read the guarantee's steps and only report a failure when the
 * step still isn't completed.
 */
export async function completeSafetyStep(guaranteeId: string, stepId: string, formData: FormData) {
  const hasBody = [...formData.keys()].length > 0;
  const { error } = await apiClient.POST("/guarantees/tasks/complete/{stepId}", {
    params: { path: { stepId } },
    ...(hasBody ? { body: formData as never } : {}),
  });
  if (!error) return;

  const steps = await getAllSafetySteps(guaranteeId);
  if (steps.find((step) => step.id === stepId)?.completed) return;
  throwIfError(error, "Failed to complete the step");
}

export async function forwardSafetyStep(stepId: string, args: ForwardWorkflowTaskArgs) {
  const { error } = await apiClient.PUT("/guarantees/tasks/transfer/{stepId}", {
    params: { path: { stepId } },
    body: {
      forward_title: args.title,
      deadline_transfer: toBackendDate(args.dueDate),
      description: args.description,
      collaborators: [args.receiverId],
    },
  });
  throwIfError(error, "Failed to forward the step");
}

export async function deleteSafetyStep(stepId: string) {
  const { error } = await apiClient.DELETE("/guarantees/tasks/{stepId}", { params: { path: { stepId } } });
  throwIfError(error, "Failed to delete the step");
}
