import type { UserSelectLabels } from "@/components/shared/user-select";

export interface CompleteTaskLabels {
  cancel: string;
  complete: string;
  documents: string;
  file: string;
  documentName: string;
  addDocument: string;
  yes: string;
  no: string;
  channelPlaceholder: string;
  channelEmail: string;
  channelCall: string;
  required: string;
  documentRequired: string;
  success: string;
  error: string;
  /** Only needed by workflows with steps that have no form: they are finished from a confirmation dialog. */
  confirmTitle?: string;
  confirmDescription?: string;
  finish?: string;
}

export interface ForwardTaskLabels {
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  receiver: string;
  observations: string;
  cancel: string;
  transfer: string;
  success: string;
  error: string;
}

export interface TimelineLabels {
  menu: string;
  validate: string;
  forward: string;
  history: string;
  completed: string;
  finish: string;
  loading: string;
  noTasks: string;
}

export interface ForwardsHistoryLabels {
  title: string;
  description: string;
  transferredOn: string;
  close: string;
}

export interface WorkflowLabels {
  complete: CompleteTaskLabels;
  forward: ForwardTaskLabels;
  timeline: TimelineLabels;
  forwardsHistory: ForwardsHistoryLabels;
  userSelect: UserSelectLabels;
  loadError: string;
}

export interface StepDialogLabels {
  addTitle: string;
  addDescription: string;
  editTitle: string;
  editDescription: string;
  titleLabel: string;
  dueDate: string;
  add: string;
  save: string;
  cancel: string;
  addSuccess: string;
  addError: string;
  editSuccess: string;
  editError: string;
}

export interface DeleteStepLabels {
  menu: string;
  edit: string;
  title: string;
  description: string;
  cancel: string;
  delete: string;
  success: string;
  error: string;
}

export interface StepsPlanningLabels extends WorkflowLabels {
  plan: string;
  planning: { title: string; addStep: string; close: string };
  stepDialog: StepDialogLabels;
  deleteStep: DeleteStepLabels;
}
