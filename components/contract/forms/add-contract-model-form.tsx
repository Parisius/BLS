"use client";
import { useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useContractModelForm } from "@/lib/contract/hooks";
import { useCreateContractModel } from "@/services/api-sdk/models/contract/contract-model";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Newspaper, Tag } from "lucide-react";
import { FileInput } from "@/components/ui/file-input";
import { useIntl } from "react-intl"; // Importez useIntl

export default function AddContractModelForm({
  formId,
  parentId,
  onSuccess,
  onError,
}) {
  const form = useContractModelForm();
  const { mutateAsync } = useCreateContractModel(parentId);
  const intl = useIntl();

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(
        {
          parentId,
          type: "file",
          name: data.filename,
          file: data.file,
        },
        {
          onSuccess: (createdData) => {
            toast({
              description: intl.formatMessage({
                id: "contract.contract.addModelForm.success",
              }),
              className: "bg-primary text-primary-foreground",
            });
            onSuccess?.(createdData);
          },
          onError: () => {
            toast({
              description: intl.formatMessage({
                id: "contract.contract.addModelForm.error",
              }),
              className: "bg-destructive text-destructive-foreground",
            });
            onError?.();
          },
        }
      );
    },
    [mutateAsync, onError, onSuccess, parentId, intl]
  );

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }
  }, [form]);

  return (
    <Form {...form}>
      <form
        id={formId}
        className="space-y-5"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="filename"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {intl.formatMessage({
                  id: "contract.contract.addModelForm.filenameLabel",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "contract.contract.addModelForm.filenamePlaceholder",
                    })}
                    className="h-12 pl-10"
                  />
                  <Tag className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
                {intl.formatMessage({
                  id: "contract.contract.addModelForm.fileLabel",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <FileInput
                    {...field}
                    disabled={form.formState.isSubmitting}
                    placeholder={intl.formatMessage({
                      id: "contract.contract.addModelForm.filePlaceholder",
                    })}
                    className="h-12 pl-10"
                  />
                  <Newspaper className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
