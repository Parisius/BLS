"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllUsers } from "@/services/api-sdk/models/user/user";
import { useIntl } from "react-intl";

export function UserSelectComponent({ className, ...props }) {
  const { data, isLoading, isError } = useAllUsers();
  const intl = useIntl();

  if (isError) {
    throw new Error("Failed to load users");
  }

  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        <SelectValue
          placeholder={intl.formatMessage({
            id: "litigation.litigation.selectCollaboratorPlaceholder",
          })}
        />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {intl.formatMessage({ id: "litigation.litigation.loading" })}{" "}
          </SelectItem>
        )}
        {!data ||
          (data.length === 0 && (
            <SelectItem disabled value="__empty__">
              {intl.formatMessage({
                id: "litigation.litigation.noCollaboratorsFound",
              })}{" "}
            </SelectItem>
          ))}
        {data?.map((collaborator) => (
          <SelectItem key={collaborator.id} value={collaborator.id}>
            {collaborator.lastname} {collaborator.firstname}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
