"use client";

import { Can } from "@/components/auth/can";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, FolderOpen, Group, NotepadTextDashed, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getFileIcon } from "@/lib/shared/icon-utils";
import { useCreateContractModel, useDeleteContractModel } from "@/lib/contract/hooks";
import { useContractModelForm, useContractModelCategoryForm } from "@/lib/contract/forms";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type { ContractModelItem } from "@/lib/contract/models";

export function ContractModelsList({
  models,
  isLoading,
}: {
  models: ContractModelItem[];
  isLoading: boolean;
}) {
  const { t } = useDictionary();
  const tc = t.contract;

  if (isLoading) {
    return <p className="text-center text-lg italic text-foreground/75">{tc.modelsList.loading}</p>;
  }
  if (models.length === 0) {
    return <p className="text-center text-lg italic text-foreground/75">{tc.modelsList.noItems}</p>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-10 md:gap-20">
      {models.map((model) => (
        <div key={model.id} className="group flex flex-col items-center">
          <div
            style={{
              backgroundImage:
                model.type === "folder"
                  ? "url('/global/images/folder-icon.png')"
                  : `url('/global/images/${getFileIcon(model.fileUrl ?? model.name)}')`,
            }}
            className="relative h-40 w-28 overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat"
          >
            <div className="absolute inset-0 rounded-lg from-black/50 opacity-0 transition group-hover:bg-gradient-to-t group-hover:opacity-100" />
            <div className="absolute bottom-0 right-1 flex translate-y-full items-center gap-2 transition-all group-hover:bottom-1 group-hover:translate-y-0">
              {model.type === "file" && model.fileUrl && (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-accent/50"
                        render={
                          <a href={model.fileUrl} target="_blank" rel="noopener noreferrer" />
                        }
                      />
                    }
                  >
                    <Download />
                  </TooltipTrigger>
                  <TooltipContent>{tc.modelsList.download}</TooltipContent>
                </Tooltip>
              )}

              {model.type === "folder" && (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-accent/50"
                        render={<Link href={`/dashboard/contract/models/${model.id}`} />}
                      />
                    }
                  >
                    <FolderOpen />
                  </TooltipTrigger>
                  <TooltipContent>{tc.modelsList.open}</TooltipContent>
                </Tooltip>
              )}

              <Can permission="contract.manage_models">
                <DeleteContractModelButton modelId={model.id} />
              </Can>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger render={<span className="line-clamp-2 max-w-32 text-center font-medium" />}>
              {model.name}
            </TooltipTrigger>
            <TooltipContent>{model.name}</TooltipContent>
          </Tooltip>
        </div>
      ))}
    </div>
  );
}

function DeleteContractModelButton({ modelId }: { modelId: string }) {
  const { mutateAsync, isPending } = useDeleteContractModel();
  const { t } = useDictionary();
  const tc = t.contract;

  const handleDelete = async () => {
    await mutateAsync(modelId, {
      onSuccess: () => toast.success(tc.deleteModel.success),
      onError: () => toast.error(tc.deleteModel.error),
    });
  };

  return (
    <AlertDialog>
      <Tooltip>
        <AlertDialogTrigger
          render={
            <TooltipTrigger
              render={<Button variant="ghost" size="icon" className="bg-accent/50 text-destructive" />}
            />
          }
        >
          <Trash />
        </AlertDialogTrigger>
        <TooltipContent>{tc.modelsList.delete}</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tc.deleteModel.title}</AlertDialogTitle>
          <AlertDialogDescription>{tc.deleteModel.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tc.deleteModel.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "..." : tc.deleteModel.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AddContractModelCategoryDialogInner({ parentId }: { parentId?: string }) {
  const form = useContractModelCategoryForm();
  const { mutateAsync } = useCreateContractModel(parentId);
  const { t } = useDictionary();
  const tc = t.contract;

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      { parentId, name: values.name, type: "folder" },
      {
        onSuccess: () => {
          toast.success(tc.addCategoryForm.success);
          form.reset();
        },
        onError: () => toast.error(tc.addCategoryForm.error),
      },
    );
  });

  return (
    <Dialog>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Group />
        <span className="sr-only sm:not-sr-only">{tc.categoriesPage.newFolder}</span>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tc.addCategoryDialog.title}</DialogTitle>
          <DialogDescription>{tc.addCategoryDialog.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="add-model-category-form" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tc.categoryForm.name}</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {tc.addCategoryDialog.cancel}
          </DialogClose>
          <Button type="submit" form="add-model-category-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tc.addCategoryDialog.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddContractModelDialogInner({ parentId }: { parentId?: string }) {
  const form = useContractModelForm();
  const { mutateAsync } = useCreateContractModel(parentId);
  const { t } = useDictionary();
  const tc = t.contract;

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      { parentId, name: values.filename, type: "file", file: values.file },
      {
        onSuccess: () => {
          toast.success(tc.addModelForm.success);
          form.reset();
        },
        onError: () => toast.error(tc.addModelForm.error),
      },
    );
  });

  return (
    <Dialog>
      <DialogTrigger render={<Button className="gap-2" />}>
        <NotepadTextDashed />
        <span className="sr-only sm:not-sr-only">{tc.categoriesPage.newModel}</span>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tc.addModelDialog.title}</DialogTitle>
          <DialogDescription>{tc.addModelDialog.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="add-model-form" className="space-y-5" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="filename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tc.addModelForm.filenameLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars -- `value` is deliberately excluded: file inputs can't be value-controlled
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>{tc.addModelForm.fileLabel}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="file"
                      className="h-12"
                      onChange={(e) => onChange(e.target.files?.[0] ?? null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {tc.addModelDialog.cancel}
          </DialogClose>
          <Button type="submit" form="add-model-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tc.addModelDialog.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddContractModelCategoryDialog(props: React.ComponentProps<typeof AddContractModelCategoryDialogInner>) {
  return (
    <Can permission="contract.manage_models">
      <AddContractModelCategoryDialogInner {...props} />
    </Can>
  );
}

export function AddContractModelDialog(props: React.ComponentProps<typeof AddContractModelDialogInner>) {
  return (
    <Can permission="contract.manage_models">
      <AddContractModelDialogInner {...props} />
    </Can>
  );
}
