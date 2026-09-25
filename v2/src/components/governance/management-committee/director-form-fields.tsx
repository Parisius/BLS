"use client";

import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type { Control } from "react-hook-form";
import type { UpdateDirectorFormValues } from "@/lib/governance/management-committee/forms";

/**
 * Shared by the add and update director forms. Typed against the base
 * (update) shape — the add form's extra `mandateStartDate` field is rendered
 * by that dialog, and its control is passed in cast to this base type.
 */
export function DirectorFormFields({ control }: { control: Control<UpdateDirectorFormValues> }) {
  const { t } = useDictionary();
  const tg = t.managementCommittee;

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-6">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>{tg.directorForm.nameLabel}</FormLabel>
            <FormControl>
              <Input {...field} className="h-12" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="nationality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tg.directorForm.nationalityLabel}</FormLabel>
            <FormControl>
              <Input {...field} className="h-12" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tg.directorForm.birthDateLabel}</FormLabel>
            <FormControl>
              <Input type="date" {...field} className="h-12" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="birthPlace"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tg.directorForm.birthPlaceLabel}</FormLabel>
            <FormControl>
              <Input {...field} className="h-12" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tg.directorForm.addressLabel}</FormLabel>
            <FormControl>
              <Input {...field} className="h-12" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
