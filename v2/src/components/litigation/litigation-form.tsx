"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import type { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LinkSelect } from "@/components/shared/link-select";
import { DocumentsForm } from "@/components/contract/documents-form";
import { AddPartyDialog } from "@/components/litigation/add-party-dialog";
import { useAllJurisdictions, useAllNatures, useAllParties } from "@/lib/litigation/hooks";
import { PARTY_CATEGORIES, PARTY_TYPES } from "@/lib/litigation/constants";
import type { LitigationFormValues } from "@/lib/litigation/forms";
import { useDictionary } from "@/lib/i18n/locale-provider";

interface LitigationFormProps {
  formId: string;
  form: UseFormReturn<LitigationFormValues>;
  partiesArray: UseFieldArrayReturn<LitigationFormValues, "parties">;
  filesArray: UseFieldArrayReturn<LitigationFormValues, "files">;
  emptyParty: LitigationFormValues["parties"][number];
  onSubmit: (values: LitigationFormValues) => void | Promise<void>;
}

function PartiesSection({
  form,
  partiesArray,
  emptyParty,
  onAddParty,
}: Pick<LitigationFormProps, "form" | "partiesArray" | "emptyParty"> & { onAddParty: (index: number) => void }) {
  const { t } = useDictionary();
  const tl = t.litigation;
  const { data: parties, isLoading } = useAllParties();
  const individuals = useMemo(() => (parties ?? []).filter((party) => party.type === "individual"), [parties]);
  const legalEntities = useMemo(() => (parties ?? []).filter((party) => party.type === "legal"), [parties]);
  // Base UI's <Select.Value> only resolves labels from `items`.
  const partyItems = useMemo(() => (parties ?? []).map((party) => ({ value: party.id, label: party.title })), [parties]);
  const categoryItems = useMemo(
    () => PARTY_CATEGORIES.map((value) => ({ value, label: tl.partyCategories[value] })),
    [tl],
  );
  const typeItems = useMemo(() => PARTY_TYPES.map((value) => ({ value, label: tl.partyTypes[value] })), [tl]);

  return (
    <div className="relative col-span-2 flex flex-col gap-5 rounded-xl border-2 p-5">
      <span className="absolute left-3 top-0 -translate-y-1/2 bg-background px-2 text-sm font-semibold">
        {tl.litigationForm.partiesLabel}
      </span>
      {partiesArray.fields.map((item, index) => (
        <div key={item.id} className="flex flex-col gap-3 sm:flex-row sm:gap-5">
          <FormField
            control={form.control}
            name={`parties.${index}.partyId`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{tl.partiesSection.partyLabel}</FormLabel>
                <div className="flex items-center gap-2">
                  <Select value={field.value || null} onValueChange={(next) => field.onChange(next ?? "")} items={partyItems}>
                    <FormControl>
                      <SelectTrigger className="h-12 w-full">
                        <SelectValue placeholder={tl.partySelect.placeholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoading && (
                        <SelectItem disabled value="__loading__">
                          {tl.partySelect.loading}
                        </SelectItem>
                      )}
                      {!isLoading && partyItems.length === 0 && (
                        <SelectItem disabled value="__empty__">
                          {tl.partySelect.empty}
                        </SelectItem>
                      )}
                      {[
                        [tl.partySelect.individualLabel, tl.partySelect.individualEmpty, individuals],
                        [tl.partySelect.corporateLabel, tl.partySelect.corporateEmpty, legalEntities],
                      ].map(([label, empty, group]) => (
                        <SelectGroup key={label as string}>
                          <SelectLabel>{label as string}</SelectLabel>
                          {(group as typeof individuals).length === 0 && (
                            <SelectItem disabled value={`__empty__${label}`} className="ml-5">
                              {empty as string}
                            </SelectItem>
                          )}
                          {(group as typeof individuals).map((party) => (
                            <SelectItem key={party.id} value={party.id} className="ml-5">
                              {party.title}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 shrink-0"
                    aria-label={tl.partySelect.addButton}
                    title={tl.partySelect.addButton}
                    onClick={() => onAddParty(index)}
                  >
                    <Plus />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {(
            [
              ["category", tl.partiesSection.categoryLabel, tl.partiesSection.categoryPlaceholder, categoryItems],
              ["type", tl.partiesSection.typeLabel, tl.partiesSection.typePlaceholder, typeItems],
            ] as const
          ).map(([name, label, placeholder, items]) => (
            <FormField
              key={name}
              control={form.control}
              name={`parties.${index}.${name}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{label}</FormLabel>
                  <Select value={field.value || null} onValueChange={(next) => field.onChange(next ?? "")} items={items}>
                    <FormControl>
                      <SelectTrigger className="h-12 w-full">
                        <SelectValue placeholder={placeholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {items.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {partiesArray.fields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="self-center rounded-full"
              onClick={() => partiesArray.remove(index)}
            >
              <X />
            </Button>
          )}
        </div>
      ))}
      <Button type="button" variant="ghost" className="gap-2 self-end" onClick={() => partiesArray.append(emptyParty)}>
        <Plus />
        {tl.partiesSection.addButton}
      </Button>
    </div>
  );
}

export function LitigationForm({ formId, form, partiesArray, filesArray, emptyParty, onSubmit }: LitigationFormProps) {
  const { t } = useDictionary();
  const tl = t.litigation;
  const { data: natures, isLoading: naturesLoading } = useAllNatures();
  const { data: jurisdictions, isLoading: jurisdictionsLoading } = useAllJurisdictions();
  const [addingParty, setAddingParty] = useState<number | null>(null);

  return (
    <>
    <Form {...form}>
      <form
        id={formId}
        noValidate
        className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="natureId"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>{tl.litigationForm.natureLabel}</FormLabel>
              <FormControl>
                <LinkSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={natures}
                  isLoading={naturesLoading}
                  placeholder={tl.natureSelect.placeholder}
                  loadingLabel={tl.natureSelect.loading}
                  emptyLabel={tl.natureSelect.empty}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {(
          [
            ["title", tl.litigationForm.titleLabel, "col-span-full"],
            ["caseNumber", tl.litigationForm.caseNumberLabel, "col-span-full"],
          ] as const
        ).map(([name, label, span]) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem className={span}>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={label} className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <FormField
          control={form.control}
          name="jurisdictionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tl.litigationForm.jurisdictionLabel}</FormLabel>
              <FormControl>
                <LinkSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={jurisdictions}
                  isLoading={jurisdictionsLoading}
                  placeholder={tl.jurisdictionSelect.placeholder}
                  loadingLabel={tl.jurisdictionSelect.loading}
                  emptyLabel={tl.jurisdictionSelect.empty}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jurisdictionLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tl.litigationForm.jurisdictionLocationLabel}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={tl.litigationForm.jurisdictionLocationLabel} className="h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hasProvisions"
          render={({ field }) => (
            <FormItem className="col-span-full flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(!!checked)} />
              </FormControl>
              <FormLabel className="text-base">{tl.litigationForm.hasProvisionsLabel}</FormLabel>
            </FormItem>
          )}
        />
        <PartiesSection form={form} partiesArray={partiesArray} emptyParty={emptyParty} onAddParty={setAddingParty} />
        <DocumentsForm
          label={tl.litigationForm.documentsLabel}
          fieldName="files"
          control={form.control}
          fieldArray={filesArray}
          isSubmitting={form.formState.isSubmitting}
          labels={{ file: tl.documentsForm.file, name: tl.documentsForm.name, add: tl.documentsForm.add }}
          className="col-span-full"
        />
      </form>
    </Form>
    {/* Outside the <form>: React bubbles submit events from a portalled dialog up to the enclosing form. */}
    <AddPartyDialog
      open={addingParty !== null}
      onOpenChange={(open) => !open && setAddingParty(null)}
      onCreated={(partyId) => {
        if (addingParty !== null) form.setValue(`parties.${addingParty}.partyId`, partyId, { shouldValidate: true });
      }}
    />
    </>
  );
}
