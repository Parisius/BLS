"use client";

import type { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ScoresFormValues } from "@/lib/audit/forms";

/** One row per criterion: its title and a score input out of the criterion's maximum. */
export function ScoreRows({
  form,
  scoresArray,
  titles,
  disabled,
}: {
  form: UseFormReturn<ScoresFormValues>;
  scoresArray: UseFieldArrayReturn<ScoresFormValues, "scores">;
  titles: Record<string, string>;
  disabled?: boolean;
}) {
  return (
    <>
      {scoresArray.fields.map((item, index) => (
        <div key={item.id} className="flex items-start gap-5">
          <span className="line-clamp-2 flex-1 pt-2 text-lg italic text-muted-foreground">
            {titles[item.criteriaId] ?? item.criteriaId}
          </span>
          <FormField
            control={form.control}
            name={`scores.${index}.score`}
            render={({ field }) => (
              <FormItem className="w-36">
                <div className="inline-flex items-center gap-1">
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={item.maxScore}
                      step="any"
                      disabled={disabled}
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={field.value as number | string}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="h-10"
                    />
                  </FormControl>
                  <span>/{item.maxScore}</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </>
  );
}
