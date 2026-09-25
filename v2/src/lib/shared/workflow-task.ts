/**
 * Server-defined task workflow shared by every module whose backend exposes
 * `task_*` resources with a `form.fields` definition, forwards and a
 * complete/forward endpoint (shareholding transfers, account incidents, ...).
 */
export interface WorkflowTaskField {
  type: string;
  name: string;
  label: string;
}

export interface WorkflowUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface WorkflowTaskForward {
  id: string;
  title: string;
  dueDate: string;
  description: string;
  sender: WorkflowUser;
  receiver: WorkflowUser;
}

export interface WorkflowTask {
  id: string;
  title: string;
  createdBy?: string;
  dueDate?: string;
  /** Start of the allowed window, when the backend defines one (recovery steps). */
  minDueDate?: string;
  /** Backend task kind, e.g. "task" for user-created steps. */
  kind?: string;
  completed: boolean;
  form: { title: string; code?: string; fields: WorkflowTaskField[] };
  forwards: WorkflowTaskForward[];
}

interface RawUser {
  id?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
}

export interface RawWorkflowTask {
  id?: string;
  title?: string;
  created_by?: string;
  deadline?: string;
  min_deadline?: string;
  max_deadline?: string;
  type?: string;
  status?: boolean;
  code?: string;
  form?: { form_title?: string; fields?: { type?: string; name?: string; label?: string }[] };
  transfers?: {
    id?: string;
    title?: string;
    deadline?: string;
    description?: string;
    sender?: RawUser;
    collaborators?: RawUser[];
  }[];
}

const toUser = (user?: RawUser): WorkflowUser => ({
  id: user?.id ?? "",
  firstname: user?.firstname ?? "",
  lastname: user?.lastname ?? "",
  email: user?.email ?? "",
});

// Some backend forms carry an unresolved translation key (e.g. "req_1.form_title") instead of a title.
const looksLikeTranslationKey = (value: string) => /^[\w-]+(\.[\w-]+)+$/.test(value);

export function mapWorkflowTask(item: RawWorkflowTask): WorkflowTask {
  const formTitle = item.form?.form_title ?? "";
  return {
    id: item.id!,
    title: item.title ?? "",
    createdBy: item.created_by,
    dueDate: item.deadline ?? item.max_deadline,
    minDueDate: item.min_deadline,
    kind: item.type,
    completed: !!item.status,
    form: {
      title: !formTitle || looksLikeTranslationKey(formTitle) ? (item.title ?? "") : formTitle,
      code: item.code,
      fields: (item.form?.fields ?? []).map((field) => ({
        type: field.type ?? "text",
        name: field.name ?? "",
        label: field.label ?? "",
      })),
    },
    forwards: (item.transfers ?? []).map((transfer) => ({
      id: transfer.id ?? "",
      title: transfer.title ?? "",
      dueDate: transfer.deadline ?? "",
      description: transfer.description ?? "",
      sender: toUser(transfer.sender),
      receiver: toUser(transfer.collaborators?.[0]),
    })),
  };
}

export interface ForwardWorkflowTaskArgs {
  title: string;
  dueDate: string;
  description: string;
  receiverId: string;
}
