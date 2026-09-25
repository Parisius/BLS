"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LinkSelect } from "@/components/shared/link-select";
import { useAutonomousGuarantees, useSafetyContracts } from "@/lib/safety/hooks";
import {
  useMortgageForm,
  useMovableForm,
  usePersonalForm,
  type MortgageFormValues,
  type MovableFormValues,
  type PersonalFormValues,
} from "@/lib/safety/forms";
import { FORMALIZATION_TYPES, MOVABLE_SECURITIES, MOVABLE_TYPES, PERSONAL_TYPES, type SafetyKind } from "@/lib/safety/kinds";
import type { CreateGuaranteeArgs } from "@/lib/safety/guarantees";
import { useDictionary } from "@/lib/i18n/locale-provider";

interface KindFormProps {
  formId: string;
  onSubmit: (args: CreateGuaranteeArgs) => Promise<void>;
}

function useContractOptions() {
  const { data, isLoading } = useSafetyContracts();
  const options = useMemo(() => (data ?? []).map((c) => ({ id: c.id, title: c.title })), [data]);
  return { options, isLoading };
}

function ContractField({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  const { t } = useDictionary();
  const tf = t.safety.form;
  const { options, isLoading } = useContractOptions();
  return (
    <LinkSelect
      value={value}
      onValueChange={onChange}
      options={options}
      isLoading={isLoading}
      placeholder={tf.selectContract}
      loadingLabel={t.safety.common.loading}
      emptyLabel={tf.noContracts}
    />
  );
}

function MortgageForm({ formId, onSubmit }: KindFormProps) {
  const form = useMortgageForm();
  const { t } = useDictionary();
  const tf = t.safety.form;

  return (
    <Form {...form}>
      <form
        id={formId}
        noValidate
        className="space-y-6"
        onSubmit={form.handleSubmit((values: MortgageFormValues) => onSubmit(values))}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tf.title}</FormLabel>
              <FormControl>
                <Input {...field} className="h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contractId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tf.contract}</FormLabel>
              <FormControl>
                <ContractField value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

function MovableForm({ formId, onSubmit }: KindFormProps) {
  const form = useMovableForm();
  const { t } = useDictionary();
  const tf = t.safety.form;
  const security = form.watch("security");
  const type = form.watch("type");

  const securityItems = MOVABLE_SECURITIES.map((value) => ({ value, label: t.safety.movableSecurities[value] }));
  const typeItems = (security ? MOVABLE_TYPES[security] : []).map((value) => ({
    value,
    label: t.safety.movableTypes[value as keyof typeof t.safety.movableTypes],
  }));
  const formalizationItems = FORMALIZATION_TYPES.map((value) => ({ value, label: t.safety.formalizationTypes[value] }));

  return (
    <Form {...form}>
      <form
        id={formId}
        noValidate
        className="space-y-6"
        onSubmit={form.handleSubmit((values: MovableFormValues) => onSubmit(values))}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tf.title}</FormLabel>
              <FormControl>
                <Input {...field} className="h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="security"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tf.security}</FormLabel>
              <FormControl>
                <Select
                  value={field.value ?? null}
                  onValueChange={(next) => {
                    field.onChange(next);
                    form.setValue("type", "");
                    form.setValue("formalizationType", undefined);
                  }}
                  items={securityItems}
                >
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder={tf.securityPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {securityItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
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
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tf.movableType}</FormLabel>
              <FormControl>
                <Select
                  value={field.value || null}
                  onValueChange={(next) => field.onChange(next ?? "")}
                  disabled={!security}
                  items={typeItems}
                >
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder={tf.movableTypePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {typeItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {type && type !== "vehicle" && (
          <FormField
            control={form.control}
            name="formalizationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tf.formalization}</FormLabel>
                <FormControl>
                  <Select value={field.value ?? null} onValueChange={field.onChange} items={formalizationItems}>
                    <SelectTrigger className="h-12 w-full">
                      <SelectValue placeholder={tf.formalizationPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {formalizationItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
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
        <FormField
          control={form.control}
          name="contractId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tf.contract}</FormLabel>
              <FormControl>
                <ContractField value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

function PersonalForm({ formId, onSubmit }: KindFormProps) {
  const form = usePersonalForm();
  const { t } = useDictionary();
  const tf = t.safety.form;
  const type = form.watch("type");
  const guarantees = useAutonomousGuarantees();
  const typeItems = PERSONAL_TYPES.map((value) => ({ value, label: t.safety.personalTypes[value] }));

  return (
    <Form {...form}>
      <form
        id={formId}
        noValidate
        className="space-y-6"
        onSubmit={form.handleSubmit((values: PersonalFormValues) =>
          onSubmit({
            title: values.title,
            type: values.type,
            contractId: values.type === "autonomous_counter" ? undefined : values.contractId,
            autonomousId: values.type === "autonomous_counter" ? values.guaranteeId : undefined,
          }),
        )}
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tf.type}</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(next) => {
                    field.onChange(next);
                    form.setValue("contractId", "");
                    form.setValue("guaranteeId", "");
                  }}
                  items={typeItems}
                >
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder={tf.typePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {typeItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
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
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tf.title}</FormLabel>
              <FormControl>
                <Input {...field} className="h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {type === "autonomous_counter" ? (
          <FormField
            control={form.control}
            name="guaranteeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tf.autonomousGuarantee}</FormLabel>
                <FormControl>
                  <LinkSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    options={guarantees.data}
                    isLoading={guarantees.isLoading}
                    placeholder={tf.selectAutonomousGuarantee}
                    loadingLabel={t.safety.common.loading}
                    emptyLabel={tf.noGuarantees}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="contractId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tf.contract}</FormLabel>
                <FormControl>
                  <ContractField value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
}

export function SafetyKindForm({ kind, ...props }: KindFormProps & { kind: SafetyKind }) {
  if (kind === "mortgage") return <MortgageForm {...props} />;
  if (kind === "movable-safety") return <MovableForm {...props} />;
  return <PersonalForm {...props} />;
}
