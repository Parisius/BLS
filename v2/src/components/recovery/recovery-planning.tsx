"use client";

import { StepsPlanningSheet } from "@/components/shared/workflow-tasks/steps-planning-sheet";
import {
  useAllRecoverySteps,
  useCompleteRecoveryStep,
  useCreateRecoveryStep,
  useDeleteRecoveryStep,
  useForwardRecoveryStep,
  useUpdateRecoveryStep,
} from "@/lib/recovery/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function RecoveryPlanningModal({
  recoveryId,
  reference,
  nextStepId,
}: {
  recoveryId: string;
  reference?: string;
  nextStepId?: string;
}) {
  const { t } = useDictionary();
  const tr = t.recovery;
  const { data, isLoading, isError } = useAllRecoverySteps(recoveryId);
  const { mutateAsync: create } = useCreateRecoveryStep(recoveryId);
  const { mutateAsync: update } = useUpdateRecoveryStep(recoveryId);
  const { mutateAsync: remove } = useDeleteRecoveryStep(recoveryId);
  const { mutateAsync: complete } = useCompleteRecoveryStep(recoveryId);
  const { mutateAsync: forward } = useForwardRecoveryStep(recoveryId);

  return (
    <StepsPlanningSheet
      reference={reference}
      nextStepId={nextStepId}
      tasks={data}
      isLoading={isLoading}
      isError={isError}
      labels={{
        plan: tr.details.plan,
        planning: tr.planning,
        stepDialog: tr.stepDialog,
        deleteStep: tr.deleteStep,
        complete: tr.completeTaskDialog,
        forward: tr.forwardTaskDialog,
        timeline: tr.timeline,
        forwardsHistory: tr.forwardsHistory,
        userSelect: tr.userSelect,
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
