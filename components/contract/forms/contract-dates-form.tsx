"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DateInput } from "@/components/ui/date-input";
import { useContractDatesForm } from "@/lib/contract/hooks/use-contract-dates-form";
import { useCallback, useMemo } from "react";
import { toast } from "@/components/ui/use-toast";
import { usePlanContractDates } from "@/services/api-sdk/models/contract/contract";
import { useIntl } from "react-intl";

export default function ContractDatesForm({
  contractId,
  defaultDate,
  formId,
  dateType,
  onSuccess,
  onError,
}) {
  const intl = useIntl();
  const form = useContractDatesForm(dateType, defaultDate);
  const { mutateAsync } = usePlanContractDates(contractId);

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: () => {
          toast({
            description: intl.formatMessage({
              id: "contract.contract.dates.success",
            }),
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.();
        },
        onError: () => {
          toast({
            description: intl.formatMessage({
              id: "contract.contract.dates.error",
            }),
            className: "bg-destructive text-destructive-foreground",
          });
          onError?.();
        },
      });
    },
    [mutateAsync, onError, onSuccess, intl]
  );

  const label = useMemo(() => {
    switch (dateType) {
      case "signatureDate":
        return intl.formatMessage({
          id: "contract.contract.dates.signatureDate",
        });
      case "effectiveDate":
        return intl.formatMessage({
          id: "contract.contract.dates.effectiveDate",
        });
      case "expirationDate":
        return intl.formatMessage({
          id: "contract.contract.dates.expirationDate",
        });
      case "renewalDate":
        return intl.formatMessage({
          id: "contract.contract.dates.renewalDate",
        });
      default:
        return intl.formatMessage({
          id: "contract.contract.dates.defaultLabel",
        });
    }
  }, [dateType, intl]);

  return (
    <Form {...form}>
      <form
        id={formId}
        className="space-y-5"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name={dateType}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
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
      </form>
    </Form>
  );
}
