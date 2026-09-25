"use client";

import { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAllShareholders, useAllThirdParties } from "@/lib/governance/shareholding/hooks";
import type { Shareholder } from "@/lib/governance/shareholding/shareholders";
import { useDictionary } from "@/lib/i18n/locale-provider";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ShareholderSelect({
  className,
  value,
  onValueChange,
  onShareholderSelect,
  disabled,
}: SelectProps & { onShareholderSelect?: (shareholder: Shareholder) => void }) {
  const { data, isLoading } = useAllShareholders();
  const { t } = useDictionary();
  const ts = t.shareholding.selects;

  // Base UI's <Select.Value> resolves its label only from `items`, and a new
  // array identity per render makes it drop the current selection.
  const items = useMemo(
    () => (data ?? []).map((shareholder) => ({ value: shareholder.id, label: shareholder.name })),
    [data],
  );

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        const selected = next ?? "";
        const shareholder = data?.find((s) => s.id === selected);
        if (shareholder) onShareholderSelect?.(shareholder);
        onValueChange?.(selected);
      }}
      disabled={disabled}
      items={items}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={ts.shareholderPlaceholder} />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {ts.loading}
          </SelectItem>
        )}
        {!isLoading && items.length === 0 && (
          <SelectItem disabled value="__empty__">
            {ts.noShareholders}
          </SelectItem>
        )}
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ThirdPartySelect({ className, value, onValueChange, disabled }: SelectProps) {
  const { data, isLoading } = useAllThirdParties();
  const { t } = useDictionary();
  const ts = t.shareholding.selects;

  const items = useMemo(
    () => (data ?? []).map((thirdParty) => ({ value: thirdParty.id, label: thirdParty.name })),
    [data],
  );

  return (
    <Select value={value} onValueChange={(next) => onValueChange?.(next ?? "")} disabled={disabled} items={items}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={ts.thirdPartyPlaceholder} />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {ts.loading}
          </SelectItem>
        )}
        {!isLoading && items.length === 0 && (
          <SelectItem disabled value="__empty__">
            {ts.noThirdParties}
          </SelectItem>
        )}
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
