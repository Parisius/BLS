"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllIncidentAuthors } from "@/services/api-sdk/models/account-incident";
import { Plus } from "lucide-react";
import AddIncidentAuthorDialog from "@/components/account-incident/modals/add-incident-author-dialog";
import { useIntl } from "react-intl";

export function AuthorSelectComponent({ className, ...props }) {
  const intl = useIntl();
  const { data, isLoading, isError } = useAllIncidentAuthors();

  if (isError) {
    throw new Error("Failed to load authors");
  }

  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        <SelectValue
          placeholder={intl.formatMessage({
            id: "incident.incident.author.selectPlaceholder",
          })}
        />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {intl.formatMessage({ id: "incident.incident.author.loading" })}
          </SelectItem>
        )}
        {!data ||
          (data.length === 0 && (
            <SelectItem disabled value="__empty__">
              {intl.formatMessage({ id: "incident.incident.author.empty" })}
            </SelectItem>
          ))}
        {!isLoading && !isError && (
          <AddIncidentAuthorDialog>
            <SelectItem disabled value="__add__">
              <span className="inline-flex items-center gap-2">
                <Plus size={16} />
                {intl.formatMessage({
                  id: "incident.incident.author.addAuthor",
                })}
              </span>
            </SelectItem>
          </AddIncidentAuthorDialog>
        )}
        {data?.map((author) => (
          <SelectItem key={author.id} value={author.id}>
            {author.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
