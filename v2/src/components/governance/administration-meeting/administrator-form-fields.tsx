"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useDictionary } from "@/lib/i18n/locale-provider";
import { useWatch, type Control } from "react-hook-form";
import type { UpdateAdministratorFormValues } from "@/lib/governance/administration-meeting/forms";

const TYPES = ["individual", "corporate"] as const;
const QUALITIES = ["shareholder", "non_shareholder"] as const;
const ROLES = ["ca_president", "ca_executive_admin", "ca_non_executive_admin", "ca_independent_admin"] as const;

/**
 * Shared by the add and update administrator forms. Typed against the base
 * (update) shape — the add form has one extra `mandateStartDate` field,
 * rendered separately by that dialog. The add form's control is a strict
 * superset of this shape, so it's passed in cast to the base type rather
 * than making this component generic (RHF's `Path<T>` doesn't resolve
 * cleanly against a type parameter for a component with this many fields).
 */
export function AdministratorFormFields({
  control,
}: {
  control: Control<UpdateAdministratorFormValues>;
}) {
  const { t } = useDictionary();
  const tg = t.administrationMeeting;
  const type = useWatch({ control, name: "type" });

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-6">
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tg.administratorForm.typeLabel}</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                items={TYPES.map((type) => ({ value: type, label: tg.administratorType[type] }))}
              >
                <SelectTrigger className="h-12 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {tg.administratorType[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="quality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tg.administratorForm.qualityLabel}</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                items={QUALITIES.map((quality) => ({ value: quality, label: tg.administratorQuality[quality] }))}
              >
                <SelectTrigger className="h-12 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUALITIES.map((quality) => (
                    <SelectItem key={quality} value={quality}>
                      {tg.administratorQuality[quality]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="role"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>{tg.administratorForm.roleLabel}</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                items={ROLES.map((role) => ({ value: role, label: tg.administratorRole[role] }))}
              >
                <SelectTrigger className="h-12 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {tg.administratorRole[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>{tg.administratorForm.nameLabel}</FormLabel>
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
            <FormLabel>{tg.administratorForm.nationalityLabel}</FormLabel>
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
            <FormLabel>{tg.administratorForm.birthDateLabel}</FormLabel>
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
            <FormLabel>{tg.administratorForm.birthPlaceLabel}</FormLabel>
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
            <FormLabel>{tg.administratorForm.addressLabel}</FormLabel>
            <FormControl>
              <Input {...field} className="h-12" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="shares"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>{tg.administratorForm.shareLabel}</FormLabel>
            <FormControl>
              <Input
                type="number"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.valueAsNumber)}
                className="h-12"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="sharePercentage"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>{tg.administratorForm.sharePercentageLabel}</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                max={100}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.valueAsNumber)}
                className="h-12"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {type === "corporate" && (
        <>
          <FormField
            control={control}
            name="denomination"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>{tg.administratorForm.denominationLabel}</FormLabel>
                <FormControl>
                  <Input {...field} className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="companyHeadOffice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tg.administratorForm.companyHeadOfficeLabel}</FormLabel>
                <FormControl>
                  <Input {...field} className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="companyNationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tg.administratorForm.companyNationalityLabel}</FormLabel>
                <FormControl>
                  <Input {...field} className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}
