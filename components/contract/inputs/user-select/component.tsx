"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAllUsers,
  useCurrentUser,
} from "@/services/api-sdk/models/user/user";
import { useMemo } from "react";
import { useIntl } from "react-intl";

export function UserSelectComponent({ className, ...props }) {
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading, isError } = useAllUsers();
  const intl = useIntl();

  if (isError) {
    throw new Error("Failed to load users");
  }

  const users = useMemo(() => {
    if (!currentUser || !data) return [];
    return data?.filter((user) => user.id !== currentUser?.id);
  }, [currentUser, data]);

  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        <SelectValue
          placeholder={intl.formatMessage({
            id: "contract.contract.userSelect.placeholder",
          })}
        />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {intl.formatMessage({ id: "contract.contract.userSelect.loading" })}
          </SelectItem>
        )}
        {!data ||
          (data.length === 0 && (
            <SelectItem disabled value="__empty__">
              {intl.formatMessage({
                id: "contract.contract.userSelect.noRecipients",
              })}
            </SelectItem>
          ))}
        {users?.map((collaborator) => (
          <SelectItem key={collaborator.id} value={collaborator.id}>
            {collaborator.lastname} {collaborator.firstname}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
