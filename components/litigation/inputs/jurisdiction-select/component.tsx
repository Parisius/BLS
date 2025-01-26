"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllJurisdictions } from "@/services/api-sdk/models/legal-monitoring/jurisdiction";
import { useIntl } from "react-intl";

export function JurisdictionSelectComponent({ className, ...props }) {
  const { data, isLoading, isError } = useAllJurisdictions();
  const { formatMessage } = useIntl();

  if (isError) {
    throw new Error("Failed to load jurisdictions");
  }

  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        <SelectValue
          placeholder={formatMessage({
            id: "litigation.litigation.jurisdictionSelect.placeholder",
          })}
        />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {formatMessage({
              id: "litigation.litigation.jurisdictionSelect.loading",
            })}
          </SelectItem>
        )}
        {!data ||
          (data.length === 0 && (
            <SelectItem disabled value="__empty__">
              {formatMessage({
                id: "litigation.litigation.jurisdictionSelect.empty",
              })}
            </SelectItem>
          ))}
        {data?.map((jurisdiction) => (
          <SelectItem key={jurisdiction.id} value={jurisdiction.id}>
            {jurisdiction.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
