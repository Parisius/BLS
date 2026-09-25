"use client";

import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllMeetingUsers } from "@/lib/governance/general-meeting/hooks";
import { useCurrentUser } from "@/lib/administration/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function UserSelect({ className, value, onValueChange, disabled }: SelectProps) {
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading } = useAllMeetingUsers();
  const { t } = useDictionary();
  const tg = t.generalMeeting;

  const users = useMemo(
    () => data?.filter((user) => user.id !== currentUser?.id) ?? [],
    [data, currentUser],
  );
  // Base UI's <Select.Value> only resolves a label from this `items` map — it
  // does not read the label from the rendered <SelectItem> children. Memoized
  // because a new array identity on every render makes Base UI think the
  // currently selected value is no longer in the list and clears it.
  const items = useMemo(
    () => users.map((user) => ({ value: String(user.id), label: `${user.lastname} ${user.firstname}` })),
    [users],
  );

  return (
    <Select
      value={value}
      onValueChange={(next) => onValueChange?.(next ?? "")}
      disabled={disabled}
      items={items}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={tg.userSelect.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {t.common.loading}
          </SelectItem>
        )}
        {!isLoading && users.length === 0 && (
          <SelectItem disabled value="__empty__">
            {tg.userSelect.noResults}
          </SelectItem>
        )}
        {users.map((user) => (
          <SelectItem key={user.id} value={String(user.id)}>
            {user.lastname} {user.firstname}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
