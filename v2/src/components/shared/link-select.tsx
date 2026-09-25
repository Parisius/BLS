"use client";

import { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export interface LinkOption {
  id: string;
  title: string;
}

interface LinkSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  options?: LinkOption[];
  isLoading: boolean;
  placeholder: string;
  loadingLabel: string;
  emptyLabel: string;
}

/** Picker for the contract/guarantee a record (recovery, safety) is attached to. */
export function LinkSelect({ value, onValueChange, options, isLoading, placeholder, loadingLabel, emptyLabel }: LinkSelectProps) {
  const items = useMemo(() => (options ?? []).map((o) => ({ value: o.id, label: o.title })), [options]);

  return (
    <Select value={value || null} onValueChange={(next) => onValueChange(next ?? "")} items={items}>
      <SelectTrigger className="h-12 w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {loadingLabel}
          </SelectItem>
        )}
        {!isLoading && items.length === 0 && (
          <SelectItem disabled value="__empty__">
            {emptyLabel}
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
