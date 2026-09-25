"use client";

import { Plus, Tag, X, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type {
  Control,
  FieldValues,
  Path,
  UseFieldArrayReturn,
} from "react-hook-form";

interface DocumentsFormProps<T extends FieldValues> {
  label: string;
  fieldName: Path<T>;
  control: Control<T>;
  fieldArray: UseFieldArrayReturn<T>;
  isSubmitting?: boolean;
  className?: string;
}

export function DocumentsForm<T extends FieldValues>({
  label,
  fieldName,
  control,
  fieldArray,
  isSubmitting,
  className,
}: DocumentsFormProps<T>) {
  const { t } = useDictionary();

  return (
    <div className={`relative flex flex-col gap-5 rounded-xl border-2 p-5 ${className ?? ""}`}>
      <span className="absolute left-3 top-0 -translate-y-1/2 bg-background px-2 text-sm font-semibold">
        {label}
      </span>
      {fieldArray.fields.map((item, index) => (
        <div key={item.id} className="flex gap-5">
          <FormField
            control={control}
            name={`${fieldName}.${index}.file` as Path<T>}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars -- `value` is deliberately excluded: file inputs can't be value-controlled
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem className="flex-1">
                <FormLabel>{t.contract.documents}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="file"
                      disabled={isSubmitting}
                      className="h-12 pl-10"
                      onChange={(e) => onChange(e.target.files?.[0] ?? null)}
                    />
                    <Newspaper className="pointer-events-none absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`${fieldName}.${index}.filename` as Path<T>}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{t.contract.detailsTable.title}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} disabled={isSubmitting} className="h-12 pl-10" />
                    <Tag className="pointer-events-none absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
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
            onClick={() => fieldArray.remove(index)}
          >
            <X />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        className="gap-2 self-end"
        onClick={() => fieldArray.append({ file: undefined, filename: "" } as never)}
      >
        <Plus />
        {t.contract.documents}
      </Button>
    </div>
  );
}
