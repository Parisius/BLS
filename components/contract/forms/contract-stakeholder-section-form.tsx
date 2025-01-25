"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import StakeholderSelect from "@/components/contract/inputs/stakeholder-select";
import { useIntl } from "react-intl";

export default function ContractStakeholderSectionForm({
  label,
  fieldName,
  form,
  fieldArray,
  className,
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
    fieldArray.append({ stakeholderId: "", description: "" });
  }, [fieldArray]);

  return (
    <div className={cn("relative flex flex-col gap-5", className)}>
      {label && (
        <span className="absolute left-3 top-0 -translate-y-1/2 bg-background px-2 text-sm font-semibold">
          {intl.formatMessage({
            id: "contract.contract.stakeholderSection.label",
          })}
        </span>
      )}
      {fieldArray.fields.map((item, index) => (
        <div key={item.id} className="flex gap-5">
          <FormField
            control={form.control}
            name={`${fieldName}.${index}.stakeholderId`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  {intl.formatMessage({
                    id: "contract.contract.stakeholderSection.member",
                  })}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <StakeholderSelect
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
            name={`${fieldName}.${index}.description`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  {intl.formatMessage({
                    id: "contract.contract.stakeholderSection.description",
                  })}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder={intl.formatMessage({
                        id: "contract.contract.stakeholderSection.description",
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
          id: "contract.contract.stakeholderSection.addMember",
        })}
      </Button>
    </div>
  );
}
