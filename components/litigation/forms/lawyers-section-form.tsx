"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import LawyerSelect from "@/components/litigation/inputs/lawyer-select";
import { useIntl } from "react-intl";

export default function LawyersSectionForm({
  label,
  fieldName,
  form,
  fieldArray,
  className,
}: {
  label?: string;
  fieldName?: string;
  form: any;
  fieldArray?: any;
  className?: string;
}) {
  const intl = useIntl();

  const handleRemoveRow = useCallback(
    (index) => {
      if (fieldArray.fields.length > 1) {
        fieldArray.remove(index);
      }
    },
    [fieldArray]
  );

  const handleAddRow = useCallback(() => {
    fieldArray.append({});
  }, [fieldArray]);

  return (
    <div
      className={cn(
        "relative col-span-2 flex flex-col gap-5 rounded-xl border-2 p-5",
        className
      )}
    >
      {label && (
        <span className="absolute left-3 top-0 -translate-y-1/2 bg-background px-2 text-sm font-semibold">
          {label}
        </span>
      )}
      {fieldArray.fields.map((item, index) => (
        <div key={item.id} className="flex gap-5">
          <FormField
            control={form.control}
            name={`${fieldName}.${index}.id`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  {intl.formatMessage({
                    id: "litigation.litigation.lawyerLabel",
                  })}{" "}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <LawyerSelect
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

          {fieldArray.fields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="self-center rounded-full"
              onClick={() => handleRemoveRow(index)}
            >
              <X />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        className="gap-2 self-end"
        onClick={handleAddRow}
      >
        <Plus />
        {intl.formatMessage({
          id: "litigation.litigation.addLawyerButton",
        })}{" "}
      </Button>
    </div>
  );
}
