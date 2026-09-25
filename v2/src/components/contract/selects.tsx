"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAllContractCategories,
  useAllContractCategoryTypes,
  useAllContractCategorySubTypes,
  useAllStakeholders,
  useAllContractUsers,
} from "@/lib/contract/hooks";
import { useCurrentUser } from "@/lib/administration/hooks";
import { useMemo } from "react";
import { useDictionary } from "@/lib/i18n/locale-provider";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function CategorySelect({ className, value, onValueChange, disabled }: SelectProps) {
  const { data, isLoading } = useAllContractCategories();
  const { t } = useDictionary();

  // Base UI's <Select.Value> only resolves a label from this `items` map — it
  // does not read the label from the rendered <SelectItem> children. Memoized
  // because a new array identity on every render makes Base UI think the
  // currently selected value is no longer in the list and clears it.
  const items = useMemo(
    () => data?.map((category) => ({ value: String(category.id), label: category.label })),
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
        <SelectValue placeholder={t.contract.categorySelectPlaceholder} />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {t.contract.loading}
          </SelectItem>
        )}
        {!isLoading && (data?.length ?? 0) === 0 && (
          <SelectItem disabled value="__empty__">
            {t.contract.noCategoriesFound}
          </SelectItem>
        )}
        {data?.map((category) => (
          <SelectItem key={category.id} value={String(category.id)}>
            {category.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function CategoryTypeSelect({
  className,
  value,
  onValueChange,
  disabled,
  category,
}: SelectProps & { category?: string }) {
  const { data, isLoading } = useAllContractCategoryTypes(category);
  const { t } = useDictionary();

  const items = useMemo(
    () => data?.map((type) => ({ value: String(type.id), label: type.label })),
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
        <SelectValue placeholder={t.contract.categoryTypeSelectPlaceholder} />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {t.contract.loading}
          </SelectItem>
        )}
        {!isLoading && (data?.length ?? 0) === 0 && (
          <SelectItem disabled value="__empty__">
            {t.contract.noCategoryTypesFound}
          </SelectItem>
        )}
        {data?.map((type) => (
          <SelectItem key={type.id} value={String(type.id)}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function CategorySubTypeSelect({
  className,
  value,
  onValueChange,
  disabled,
  categoryType,
}: SelectProps & { categoryType?: string }) {
  const { data, isLoading } = useAllContractCategorySubTypes(categoryType);
  const { t } = useDictionary();

  const items = useMemo(
    () => data?.map((subType) => ({ value: String(subType.id), label: subType.label })),
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
        <SelectValue placeholder={t.contract.categorySubTypeSelectPlaceholder} />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {t.contract.loading}
          </SelectItem>
        )}
        {!isLoading && (data?.length ?? 0) === 0 && (
          <SelectItem disabled value="__empty__">
            {t.contract.noCategorySubTypesFound}
          </SelectItem>
        )}
        {data?.map((subType) => (
          <SelectItem key={subType.id} value={String(subType.id)}>
            {subType.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function UserSelect({ className, value, onValueChange, disabled }: SelectProps) {
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading } = useAllContractUsers();
  const { t } = useDictionary();

  const users = useMemo(
    () => data?.filter((user) => user.id !== currentUser?.id) ?? [],
    [data, currentUser],
  );
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
        <SelectValue placeholder={t.contract.userSelect.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {t.contract.userSelect.loading}
          </SelectItem>
        )}
        {!isLoading && users.length === 0 && (
          <SelectItem disabled value="__empty__">
            {t.contract.userSelect.noRecipients}
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

export function StakeholderSelect({
  className,
  value,
  onValueChange,
  disabled,
  onAddMember,
}: SelectProps & { onAddMember?: () => void }) {
  const { data, isLoading } = useAllStakeholders();
  const { t } = useDictionary();

  const individuals = useMemo(() => data?.filter((s) => s.type === "individual") ?? [], [data]);
  const corporates = useMemo(() => data?.filter((s) => s.type === "corporate") ?? [], [data]);
  const items = useMemo(
    () => data?.map((stakeholder) => ({ value: String(stakeholder.id), label: stakeholder.name })),
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
        <SelectValue placeholder={t.contract.stakeholderSelect.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {t.contract.stakeholderSelect.loading}
          </SelectItem>
        )}
        {onAddMember && (
          // Fixed vs. the original app: there, this trigger was a *disabled*
          // SelectItem wrapping a Dialog, an unreliable combination (a
          // disabled item suppresses pointer events in most select
          // implementations). Handled here with a plain button instead, so
          // the click reliably opens the add-member dialog.
          <button
            type="button"
            onClick={onAddMember}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
          >
            <span aria-hidden>+</span>
            {t.contract.stakeholderSelect.addMember}
          </button>
        )}
        <SelectGroup>
          <SelectLabel>{t.contract.stakeholderSelect.individuals}</SelectLabel>
          {individuals.length === 0 && (
            <SelectItem disabled value="__no_individuals__">
              {t.contract.stakeholderSelect.noIndividuals}
            </SelectItem>
          )}
          {individuals.map((stakeholder) => (
            <SelectItem key={stakeholder.id} value={String(stakeholder.id)}>
              {stakeholder.name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>{t.contract.stakeholderSelect.corporates}</SelectLabel>
          {corporates.length === 0 && (
            <SelectItem disabled value="__no_corporates__">
              {t.contract.stakeholderSelect.noCorporates}
            </SelectItem>
          )}
          {corporates.map((stakeholder) => (
            <SelectItem key={stakeholder.id} value={String(stakeholder.id)}>
              {stakeholder.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
