"use client";

import { useState } from "react";
import { Plus, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { StakeholderSelect } from "@/components/contract/selects";
import { AddStakeholderDialog } from "@/components/contract/add-stakeholder-dialog";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type {
  Control,
  FieldValues,
  Path,
  UseFieldArrayReturn,
} from "react-hook-form";

interface StakeholderSectionFormProps<T extends FieldValues> {
  label: string;
  fieldName: Path<T>;
  control: Control<T>;
  fieldArray: UseFieldArrayReturn<T>;
  isSubmitting?: boolean;
  className?: string;
}

export function StakeholderSectionForm<T extends FieldValues>({
  label,
  fieldName,
  control,
  fieldArray,
  isSubmitting,
  className,
}: StakeholderSectionFormProps<T>) {
  const { t } = useDictionary();
  const [addMemberForIndex, setAddMemberForIndex] = useState<number | null>(null);

  return (
    <div className={className}>
      <span className="relative -top-8 left-3 -mt-5 mb-[-1rem] block w-fit bg-background px-2 text-sm font-semibold">
        {label}
      </span>
      <div className="flex flex-col gap-5">
        {fieldArray.fields.map((item, index) => (
          <div key={item.id} className="flex gap-5">
            <FormField
              control={control}
              name={`${fieldName}.${index}.stakeholderId` as Path<T>}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t.contract.stakeholderSection.member}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <StakeholderSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                        className="h-12 w-full pl-10"
                        onAddMember={() => setAddMemberForIndex(index)}
                      />
                      <Tag className="pointer-events-none absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`${fieldName}.${index}.description` as Path<T>}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t.contract.stakeholderSection.description}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder={t.contract.stakeholderSection.description}
                        className="h-12 pl-10"
                      />
                      <Tag className="pointer-events-none absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
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
                onClick={() => fieldArray.remove(index)}
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
          onClick={() => fieldArray.append({ stakeholderId: "", description: "" } as never)}
        >
          <Plus />
          {t.contract.stakeholderSection.addMember}
        </Button>
      </div>

      <AddStakeholderDialog
        open={addMemberForIndex !== null}
        onOpenChange={(open) => !open && setAddMemberForIndex(null)}
        onCreated={(stakeholderId) => {
          if (addMemberForIndex === null) return;
          fieldArray.update(addMemberForIndex, {
            ...fieldArray.fields[addMemberForIndex],
            stakeholderId,
          } as never);
        }}
      />
    </div>
  );
}
