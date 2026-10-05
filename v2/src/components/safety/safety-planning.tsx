"use client";

import { StepsPlanningSheet } from "@/components/shared/workflow-tasks/steps-planning-sheet";
import {
  useAllSafetySteps,
  useCompleteSafetyStep,
  useCreateSafetyStep,
  useDeleteSafetyStep,
  useForwardSafetyStep,
  useUpdateSafetyStep,
} from "@/lib/safety/hooks";
import { KIND_KEY, type SafetyKind } from "@/lib/safety/kinds";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function SafetyPlanningModal({
  kind,
  guaranteeId,
  reference,
  nextStepId,
}: {
  kind: SafetyKind;
  guaranteeId: string;
  reference?: string;
  nextStepId?: string;
}) {
  const { t } = useDictionary();
  const ts = t.safety;
  const { data, isLoading, isError } = useAllSafetySteps(guaranteeId);
  const { mutateAsync: create } = useCreateSafetyStep(guaranteeId);
  const { mutateAsync: update } = useUpdateSafetyStep(guaranteeId);
  const { mutateAsync: remove } = useDeleteSafetyStep(guaranteeId);
  const { mutateAsync: complete } = useCompleteSafetyStep(guaranteeId);
  const { mutateAsync: forward } = useForwardSafetyStep(guaranteeId);

  return (
    <StepsPlanningSheet
      permissions={{ update: "guarantee.update", forward: "guarantee.forward" }}
      reference={reference}
      nextStepId={nextStepId}
      tasks={data}
      isLoading={isLoading}
      isError={isError}
      labels={{
        plan: ts.planning.plan,
        planning: { title: ts.kinds[KIND_KEY[kind]].planning, addStep: ts.planning.addStep, close: ts.planning.close },
        stepDialog: ts.stepDialog,
        deleteStep: ts.deleteStep,
        complete: ts.completeTaskDialog,
        forward: ts.forwardTaskDialog,
        timeline: ts.timeline,
        forwardsHistory: ts.forwardsHistory,
        userSelect: ts.userSelect,
        loadError: t.common.loadError,
      }}
      onCreate={(values) => create(values)}
      onUpdate={(step, values) => update({ stepId: step.id, args: values })}
      onDelete={(step) => remove(step.id)}
      onComplete={(step, formData) => complete({ stepId: step.id, formData })}
      onForward={(step, args) => forward({ stepId: step.id, args })}
    />
  );
}
