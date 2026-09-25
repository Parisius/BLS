"use client";

import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllSubsidiaries } from "@/lib/administration/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

interface SubsidiarySelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function SubsidiarySelect({
  className,
  value,
  onValueChange,
  disabled,
}: SubsidiarySelectProps) {
  const { data, isLoading } = useAllSubsidiaries();
  const { t } = useDictionary();

  // Base UI's <Select.Value> only resolves a label from this `items` map — it
  // does not read the label from the rendered <SelectItem> children. Memoized
  // because a new array identity on every render makes Base UI think the
  // currently selected value is no longer in the list and clears it.
  const items = useMemo(
    () => data?.map((subsidiary) => ({ value: String(subsidiary.id), label: subsidiary.name })),
    [data],
  );

  return (
    <Select
      value={value}
      onValueChange={(next) => onValueChange?.(next ?? "")}
      disabled={disabled}
      items={items}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={t.administration.users.selectSubsidiary} />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {t.common.loading}
          </SelectItem>
        )}
        {!isLoading && (data?.length ?? 0) === 0 && (
          <SelectItem disabled value="__empty__">
            {t.administration.users.noSubsidiaryFound}
          </SelectItem>
        )}
        {data?.map((subsidiary) => (
          <SelectItem key={subsidiary.id} value={String(subsidiary.id)}>
            {subsidiary.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
