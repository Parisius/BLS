"use client";

import { StepsPlanningSheet } from "@/components/shared/workflow-tasks/steps-planning-sheet";
import {
  useAllLitigationTasks,
  useCompleteLitigationTask,
  useCreateLitigationTask,
  useDeleteLitigationTask,
  useForwardLitigationTask,
  useUpdateLitigationTask,
} from "@/lib/litigation/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function LitigationPlanningModal({
  litigationId,
  reference,
  nextStepId,
}: {
  litigationId: string;
  reference?: string;
  nextStepId?: string;
}) {
  const { t } = useDictionary();
  const tl = t.litigation;
  const { data, isLoading, isError } = useAllLitigationTasks(litigationId);
  const { mutateAsync: create } = useCreateLitigationTask(litigationId);
  const { mutateAsync: update } = useUpdateLitigationTask(litigationId);
  const { mutateAsync: remove } = useDeleteLitigationTask(litigationId);
  const { mutateAsync: complete } = useCompleteLitigationTask(litigationId);
  const { mutateAsync: forward } = useForwardLitigationTask(litigationId);

  return (
    <StepsPlanningSheet
      reference={reference}
      nextStepId={nextStepId}
      tasks={data}
      isLoading={isLoading}
      isError={isError}
      labels={{
        plan: tl.planning.plan,
        planning: { title: tl.planningTitle, addStep: tl.planning.addStep, close: tl.planning.close },
        stepDialog: tl.stepDialog,
        deleteStep: tl.deleteStep,
        complete: tl.completeTaskDialog,
        forward: tl.forwardTaskDialog,
        timeline: tl.timeline,
        forwardsHistory: tl.forwardsHistory,
        userSelect: tl.userSelect,
        loadError: t.common.loadError,
      }}
      onCreate={(values) => create(values)}
      onUpdate={(task, values) => update({ taskId: task.id, args: values })}
      onDelete={(task) => remove(task.id)}
      onComplete={(task, formData) => complete({ taskId: task.id, formData })}
      onForward={(task, args) => forward({ taskId: task.id, args })}
    />
  );
}
