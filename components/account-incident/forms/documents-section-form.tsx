"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Newspaper, Plus, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { FileInput } from "@/components/ui/file-input";
import { useIntl } from "react-intl";

export default function DocumentsSectionForm({
  label,
  fieldName,
  form,
  fieldArray,
  className,
}) {
  const intl = useIntl();

  const handleRemoveRow = useCallback(
    (index) => {
      fieldArray.remove(index);
    },
    [fieldArray]
  );

  const handleAddRow = useCallback(() => {
    fieldArray.append({ file: null, name: "" });
  }, [fieldArray]);

  return (
    <div className={cn("relative flex flex-col gap-5", className)}>
      {label && (
        <span className="absolute left-3 top-0 -translate-y-1/2 bg-background px-2 text-sm font-semibold">
          {label}
        </span>
      )}
      {fieldArray.fields.map((item, index) => (
        <div key={item.id} className="flex gap-5">
          <FormField
            control={form.control}
            name={`${fieldName}.${index}.file`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  {intl.formatMessage({ id: "incident..form.file" })}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <FileInput
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder={intl.formatMessage({
                        id: "incident..form.addFile",
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

          <FormField
            control={form.control}
            name={`${fieldName}.${index}.name`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  {intl.formatMessage({ id: "incident..form.documentName" })}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder={intl.formatMessage({
                        id: "incident..form.documentName",
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
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="self-center rounded-full"
            onClick={() => handleRemoveRow(index)}
          >
            <X />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        className="gap-2 self-end"
        onClick={handleAddRow}
      >
        <Plus />
        {intl.formatMessage({ id: "incident.form.addDocument" })}
      </Button>
    </div>
  );
}
