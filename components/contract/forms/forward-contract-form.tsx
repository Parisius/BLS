"use client";
import { useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useForwardContractForm } from "@/lib/contract/hooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";
import { DateInput } from "@/components/ui/date-input";
import { Textarea } from "@/components/ui/textarea";
import UserSelect from "@/components/contract/inputs/user-select";
import { useForwardContract } from "@/services/api-sdk/models/contract/contract";
import { useIntl } from "react-intl";

export default function ForwardContractForm({
  formId,
  contractId,
  onSuccess,
  onError,
}) {
  const form = useForwardContractForm();
  const { mutateAsync } = useForwardContract(contractId);
  const intl = useIntl();

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: () => {
          toast({
            description: intl.formatMessage({
              id: "contract.contract.forwardForm.success",
            }),
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.();
        },
        onError: () => {
          toast({
            description: intl.formatMessage({
              id: "contract.contract.forwardForm.error",
            }),
            className: "bg-destructive text-destructive-foreground",
          });
          onError?.();
        },
      });
    },
    [mutateAsync, onError, onSuccess, intl]
  );

  return (
    <Form {...form}>
      <form
        id={formId}
        className="space-y-5"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {intl.formatMessage({
                  id: "contract.contract.forwardForm.subjectLabel",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "contract.contract.forwardForm.subjectPlaceholder",
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
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {intl.formatMessage({
                  id: "contract.contract.forwardForm.dueDateLabel",
                })}
              </FormLabel>
              <FormControl>
                <DateInput
                  value={field.value}
                  className="h-12"
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="receiverId"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
                {intl.formatMessage({
                  id: "contract.contract.forwardForm.receiverLabel",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <UserSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={form.formState.isSubmitting}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {intl.formatMessage({
                  id: "contract.contract.forwardForm.observationsLabel",
                })}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={form.formState.isSubmitting}
                  placeholder={intl.formatMessage({
                    id: "contract.contract.forwardForm.observationsPlaceholder",
                  })}
                  className="resize-none"
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
