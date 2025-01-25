"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useStakeholderForm } from "@/lib/contract/hooks";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormProvider } from "react-hook-form";
import IndividualMemberForm from "@/components/contract/forms/individual-member-form";
import CorporateMemberForm from "@/components/contract/forms/corporate-member-form";
import { cn } from "@/lib/utils";
import { useIntl } from "react-intl";

export default function StakeholderForm({ formId, className, onSubmit }) {
  const form = useStakeholderForm();
  const intl = useIntl();

  return (
    <Form {...form}>
      <div className={cn("space-y-5", className)}>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex items-center justify-center gap-5"
                >
                  <FormItem className="flex items-center gap-1 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="individual" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {intl.formatMessage({
                        id: "contract.contract.stakeholderForm.individual",
                      })}
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center gap-1 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="corporate" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {intl.formatMessage({
                        id: "contract.contract.stakeholderForm.corporate",
                      })}
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormProvider {...form}>
          {form.watch("type") === "individual" ? (
            <IndividualMemberForm formId={formId} onSubmit={onSubmit} />
          ) : (
            <CorporateMemberForm formId={formId} onSubmit={onSubmit} />
          )}
        </FormProvider>
      </div>
    </Form>
  );
}
