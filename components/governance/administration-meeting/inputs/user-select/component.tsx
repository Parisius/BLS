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
import { FormattedMessage, useIntl } from "react-intl";
export function UserSelectComponent({ className, ...props }) {
  const intl = useIntl();
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading, isError } = useAllUsers();
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
            id: "sessionAdministrator.selectRecipientPlaceholder",
          })}
        />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            <FormattedMessage id="sessionAdministrator.transferTaskDescription" />
          </SelectItem>
        )}
        {!data ||
          (data.length === 0 && (
            <SelectItem disabled value="__empty__">
              <FormattedMessage id="sessionAdministrator.noRecipientsFound" />
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
