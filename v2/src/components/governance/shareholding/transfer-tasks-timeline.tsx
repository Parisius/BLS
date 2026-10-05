"use client";

import { WorkflowTasksTimeline } from "@/components/shared/workflow-tasks/tasks-timeline";
import { useAllTransferTasks, useCompleteTransferTask, useForwardTransferTask } from "@/lib/governance/shareholding/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function TransferTasksTimeline({ transferId, currentTaskId }: { transferId: string; currentTaskId?: string }) {
  const { t } = useDictionary();
  const ts = t.shareholding;
  const { data, isLoading, isError } = useAllTransferTasks(transferId);
  const { mutateAsync: complete } = useCompleteTransferTask(transferId);
  const { mutateAsync: forward } = useForwardTransferTask(transferId);

  return (
    <WorkflowTasksTimeline
      permissions={{ update: "governance.manage_shareholding" }}
      tasks={data}
      isLoading={isLoading}
      isError={isError}
      currentTaskId={currentTaskId}
      labels={{
        complete: ts.completeTaskDialog,
        forward: ts.forwardTaskDialog,
        timeline: ts.timeline,
        forwardsHistory: ts.forwardsHistory,
        userSelect: ts.userSelect,
        loadError: t.common.loadError,
      }}
      onComplete={(task, formData) => complete({ taskId: task.id, formData })}
      onForward={(task, args) => forward({ taskId: task.id, args })}
    />
  );
}
