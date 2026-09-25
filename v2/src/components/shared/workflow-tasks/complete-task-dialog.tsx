"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { WorkflowTask } from "@/lib/shared/workflow-task";
import type { CompleteTaskLabels } from "@/components/shared/workflow-tasks/labels";

interface DocumentRow {
  key: number;
  file: File | null;
  name: string;
}

interface DialogState {
  values: Record<string, string>;
  documents: Record<string, DocumentRow[]>;
  errors: Record<string, string>;
}

// The backend names its file field type differently per module ("documents", "files", "file").
const isFilesField = (type: string) => ["documents", "files", "file", "document"].includes(type);

const today = () => new Date().toLocaleDateString("en-CA");

/**
 * The task's form is defined by the backend (`task.form.fields`): text,
 * select, radio, date and files fields. Bug fixes vs. the original app: radio
 * fields defaulted to a boolean (the serializer then crashed on submit when
 * left untouched) and nothing was validated before submitting.
 */
function initialState(task: WorkflowTask): DialogState {
  const values: Record<string, string> = {};
  const documents: Record<string, DocumentRow[]> = {};
  for (const field of task.form.fields) {
    if (isFilesField(field.type)) documents[field.name] = [];
    else values[field.name] = field.type === "date" ? today() : "";
  }
  return { values, documents, errors: {} };
}

export function CompleteWorkflowTaskDialog({
  task,
  open,
  onOpenChange,
  onSubmit,
  labels: td,
}: {
  task: WorkflowTask;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Receives the multipart body (fields + `type` = form code); the caller adds its own ids. */
  onSubmit: (formData: FormData) => Promise<void>;
  labels: CompleteTaskLabels;
}) {
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState(() => initialState(task));
  const [nextKey, setNextKey] = useState(1);

  const setValue = (name: string, value: string) =>
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [name]: value },
      errors: { ...prev.errors, [name]: "" },
    }));

  const setDocuments = (name: string, rows: DocumentRow[]) =>
    setState((prev) => ({ ...prev, documents: { ...prev.documents, [name]: rows }, errors: { ...prev.errors, [name]: "" } }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const errors: Record<string, string> = {};
    for (const field of task.form.fields) {
      if (isFilesField(field.type)) {
        const rows = state.documents[field.name];
        if (rows.length === 0) errors[field.name] = td.documentRequired;
        else if (rows.some((row) => !row.file || !row.name.trim())) errors[field.name] = td.required;
      } else if (!state.values[field.name]?.trim()) {
        errors[field.name] = td.required;
      }
    }
    if (Object.keys(errors).length > 0) {
      setState((prev) => ({ ...prev, errors }));
      return;
    }

    const formData = new FormData();
    if (task.form.code) formData.append("type", task.form.code);
    for (const field of task.form.fields) {
      if (isFilesField(field.type)) {
        state.documents[field.name].forEach((row, index) => {
          formData.append(`${field.name}[${index}][file]`, row.file as File);
          formData.append(`${field.name}[${index}][name]`, row.name.trim());
        });
      } else {
        formData.append(field.name, state.values[field.name].trim());
      }
    }

    setIsPending(true);
    try {
      await onSubmit(formData);
      toast.success(td.success);
      onOpenChange(false);
    } catch {
      toast.error(td.error);
    } finally {
      setIsPending(false);
    }
  };

  const channels = [
    { value: "email", label: td.channelEmail },
    { value: "call", label: td.channelCall },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{task.form.title || task.title}</DialogTitle>
        </DialogHeader>
        <form
          id={`complete-task-${task.id}`}
          noValidate
          className="-mx-4 max-h-[60vh] space-y-5 overflow-y-auto px-4 py-1"
          onSubmit={handleSubmit}
        >
          {task.form.fields.map((field) => {
            const error = state.errors[field.name];
            const errorNode = error ? <p className="text-sm text-destructive">{error}</p> : null;

            if (isFilesField(field.type)) {
              const rows = state.documents[field.name] ?? [];
              return (
                <div key={field.name} className="relative flex flex-col gap-5 rounded-xl border-2 p-5">
                  <span className="absolute left-3 top-0 -translate-y-1/2 bg-background px-2 text-sm font-semibold">
                    {field.label || td.documents}
                  </span>
                  {rows.map((row) => (
                    <div key={row.key} className="flex gap-3">
                      <div className="flex-1 space-y-2">
                        <Label>{td.file}</Label>
                        <Input
                          type="file"
                          // The backend rejects anything else ("must be a file of type: pdf, doc, docx").
                          accept=".pdf,.doc,.docx"
                          onChange={(e) =>
                            setDocuments(
                              field.name,
                              rows.map((r) => (r.key === row.key ? { ...r, file: e.target.files?.[0] ?? null } : r)),
                            )
                          }
                          className="h-12"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>{td.documentName}</Label>
                        <Input
                          value={row.name}
                          placeholder={td.documentName}
                          onChange={(e) =>
                            setDocuments(
                              field.name,
                              rows.map((r) => (r.key === row.key ? { ...r, name: e.target.value } : r)),
                            )
                          }
                          className="h-12"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="self-center rounded-full"
                        onClick={() =>
                          setDocuments(
                            field.name,
                            rows.filter((r) => r.key !== row.key),
                          )
                        }
                      >
                        <X />
                      </Button>
                    </div>
                  ))}
                  {errorNode}
                  <Button
                    type="button"
                    variant="ghost"
                    className="gap-2 self-end"
                    onClick={() => {
                      setDocuments(field.name, [...rows, { key: nextKey, file: null, name: "" }]);
                      setNextKey(nextKey + 1);
                    }}
                  >
                    <Plus />
                    {td.addDocument}
                  </Button>
                </div>
              );
            }

            if (field.type === "radio") {
              return (
                <div key={field.name} className="space-y-2">
                  <Label>{field.label}</Label>
                  <RadioGroup
                    value={state.values[field.name]}
                    onValueChange={(next) => setValue(field.name, next as string)}
                    className="flex items-center gap-5"
                  >
                    {[
                      { value: "yes", label: td.yes },
                      { value: "no", label: td.no },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center gap-2">
                        <RadioGroupItem value={option.value} id={`${task.id}-${field.name}-${option.value}`} />
                        <Label htmlFor={`${task.id}-${field.name}-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errorNode}
                </div>
              );
            }

            if (field.type === "select") {
              return (
                <div key={field.name} className="space-y-2">
                  <Label>{field.label}</Label>
                  <Select
                    value={state.values[field.name] || null}
                    onValueChange={(next) => setValue(field.name, next ?? "")}
                    items={channels}
                  >
                    <SelectTrigger className="h-12 w-full">
                      <SelectValue placeholder={td.channelPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {channels.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errorNode}
                </div>
              );
            }

            return (
              <div key={field.name} className="space-y-2">
                <Label>{field.label}</Label>
                <Input
                  type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                  value={state.values[field.name]}
                  onChange={(e) => setValue(field.name, e.target.value)}
                  className="h-12"
                />
                {errorNode}
              </div>
            );
          })}
        </form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" />}>{td.cancel}</DialogClose>
          <Button type="submit" form={`complete-task-${task.id}`} disabled={isPending}>
            {isPending ? "..." : td.complete}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
