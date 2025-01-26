"use client";
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
import { useLitigationForm } from "@/lib/litigation/hooks";
import { cn } from "@/lib/utils";
import LitigationPartiesSectionForm from "@/components/litigation/forms/litigation-parties-section-form";
import DocumentsForm from "@/components/ui/documents-form";
import LitigationNatureSelect from "@/components/litigation/inputs/litigation-nature-select";
import JurisdictionSelect from "@/components/litigation/inputs/jurisdiction-select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormattedMessage, useIntl } from "react-intl"; // Import FormattedMessage

export default function LitigationForm({ formId, className, onSubmit }) {
  const intl = useIntl();
  const { form, filesArray, partiesArray } = useLitigationForm();

  return (
    <Form {...form}>
      <form
        id={formId}
        className={cn("grid grid-cols-2 gap-x-5 gap-y-10", className)}
        onSubmit={form.handleSubmit(onSubmit ?? (() => {}))}
      >
        {/* Nature Field */}
        <FormField
          control={form.control}
          name="natureId"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                <FormattedMessage id="litigation.litigation.litigationForm.natureLabel" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <LitigationNatureSelect
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

        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                <FormattedMessage id="litigation.litigation.litigationForm.titleLabel" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "litigation.litigation.litigationForm.titleLabel",
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

        {/* Case Number Field */}
        <FormField
          control={form.control}
          name="caseNumber"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                <FormattedMessage id="litigation.litigation.litigationForm.caseNumberLabel" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "litigation.litigation.litigationForm.caseNumberLabel",
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

        {/* Jurisdiction Field */}
        <FormField
          control={form.control}
          name="jurisdictionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormattedMessage id="litigation.litigation.litigationForm.jurisdictionLabel" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <JurisdictionSelect
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

        {/* Jurisdiction Location Field */}
        <FormField
          control={form.control}
          name="jurisdictionLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormattedMessage id="litigation.litigation.litigationForm.jurisdictionLocationLabel" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "litigation.litigation.litigationForm.jurisdictionLocationLabel",
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

        {/* Has Provisions Field */}
        <FormField
          control={form.control}
          name="hasProvisions"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormLabel className="text-md">
                <FormattedMessage id="litigation.litigation.litigationForm.hasProvisionsLabel" />
              </FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Parties Section */}
        <LitigationPartiesSectionForm
          label={intl.formatMessage({
            id: "litigation.litigation.litigationForm.partiesLabel",
          })}
          fieldName="parties"
          form={form}
          fieldArray={partiesArray}
        />

        {/* Documents Section */}
        <DocumentsForm
          label={
            <FormattedMessage id="litigation.litigation.litigationForm.documentsLabel" />
          }
          fieldName="files"
          form={form}
          fieldArray={filesArray}
          className="col-span-2"
        />
      </form>
    </Form>
  );
}
