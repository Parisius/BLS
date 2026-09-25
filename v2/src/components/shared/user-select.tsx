"use client";

import { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAllUsers, useCurrentUser } from "@/lib/administration/hooks";

export interface UserSelectLabels {
  placeholder: string;
  noResults: string;
  loading: string;
}

interface UserSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  labels: UserSelectLabels;
}

/** Recipient picker: every user except the current one. */
export function UserSelect({ className, value, onValueChange, disabled, labels }: UserSelectProps) {
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading } = useAllUsers();

  // Base UI's <Select.Value> resolves its label only from `items`, and a new
  // array identity per render makes it drop the current selection.
  const items = useMemo(
    () =>
      (data ?? [])
        .filter((user) => user.id !== currentUser?.id)
        .map((user) => ({ value: String(user.id), label: `${user.lastname} ${user.firstname}` })),
    [data, currentUser],
  );

  return (
    <Select value={value} onValueChange={(next) => onValueChange?.(next ?? "")} disabled={disabled} items={items}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={labels.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {labels.loading}
          </SelectItem>
        )}
        {!isLoading && items.length === 0 && (
          <SelectItem disabled value="__empty__">
            {labels.noResults}
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
