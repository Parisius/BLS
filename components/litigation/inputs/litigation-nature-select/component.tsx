"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllLegislationNatures } from "@/services/api-sdk/models/legal-monitoring/legislation-nature";
import { useIntl } from "react-intl";

export function LitigationNatureSelectComponent({ className, ...props }) {
  const { data, isLoading, isError } = useAllLegislationNatures();
  const { formatMessage } = useIntl();

  if (isError) {
    throw new Error("Failed to load litigation natures");
  }

  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        <SelectValue
          placeholder={formatMessage({
            id: "litigation.litigation.natureSelect.placeholder",
          })}
        />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {formatMessage({
              id: "litigation.litigation.natureSelect.loading",
            })}
          </SelectItem>
        )}
        {!data ||
          (data.length === 0 && (
            <SelectItem disabled value="__empty__">
              {formatMessage({
                id: "litigation.litigation.natureSelect.empty",
              })}
            </SelectItem>
          ))}
        {data?.map((nature) => (
          <SelectItem key={nature.id} value={nature.id}>
            {nature.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
