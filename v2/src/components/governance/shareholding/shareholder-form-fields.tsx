"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useDictionary } from "@/lib/i18n/locale-provider";
import { useWatch, type Control } from "react-hook-form";
import type { ShareholderFormValues } from "@/lib/governance/shareholding/forms";

const TYPES = ["individual", "corporate"] as const;
const CORPORATE_TYPES = ["company", "institution"] as const;

/**
 * Identity fields shared by the add / update shareholder forms and the
 * approve-transfer form. Typed against the full shareholder shape (RHF's
 * `Control` is invariant, so a `Pick` of it can't be passed); the approve form,
 * which has no name/share fields, casts its control and sets `withName={false}`.
 */
export function ShareholderIdentityFields({
  control,
  withName = true,
}: {
  control: Control<ShareholderFormValues>;
  withName?: boolean;
}) {
  const { t } = useDictionary();
  const tf = t.shareholding.shareholderForm;
  const type = useWatch({ control, name: "type" });

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-6">
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>{tf.typeLabel}</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                items={TYPES.map((value) => ({ value, label: t.shareholding.shareholderType[value] }))}
              >
                <SelectTrigger className="h-12 w-full">
                  <SelectValue placeholder={tf.typePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {t.shareholding.shareholderType[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {type === "corporate" && (
        <FormField
          control={control}
          name="corporateType"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>{tf.corporateTypeLabel}</FormLabel>
              <FormControl>
                <Select
                  value={field.value ?? null}
                  onValueChange={field.onChange}
                  items={CORPORATE_TYPES.map((value) => ({ value, label: t.shareholding.corporateType[value] }))}
                >
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder={tf.corporateTypePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {CORPORATE_TYPES.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t.shareholding.corporateType[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {withName && (
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>{type === "corporate" ? tf.nameCorporate : tf.nameIndividual}</FormLabel>
              <FormControl>
                <Input {...field} className="h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={control}
        name="nationality"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>{tf.nationality}</FormLabel>
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
          <FormItem className="col-span-2">
            <FormLabel>{tf.address}</FormLabel>
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

/** Full shareholder form body: identity + share counts. */
export function ShareholderFormFields({ control }: { control: Control<ShareholderFormValues> }) {
  const { t } = useDictionary();
  const tf = t.shareholding.shareholderForm;

  return (
    <div className="space-y-6">
      <ShareholderIdentityFields control={control} />
      <div className="grid grid-cols-2 gap-x-5 gap-y-6">
        <FormField
          control={control}
          name="encumberedShares"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>{tf.encumberedShares}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  value={Number.isNaN(value) ? "" : value}
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
          name="unencumberedShares"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>{tf.unencumberedShares}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  value={Number.isNaN(value) ? "" : value}
                  onChange={(e) => onChange(e.target.valueAsNumber)}
                  className="h-12"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
