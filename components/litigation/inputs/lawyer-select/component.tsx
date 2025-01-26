"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllLawyers } from "@/services/api-sdk/models/user/lawyer";
import { useIntl } from "react-intl";

export function LawyerSelectComponent({ className, ...props }) {
  const { data, isLoading, isError } = useAllLawyers();
  const intl = useIntl();

  if (isError) {
    throw new Error("Failed to load lawyers");
  }

  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        <SelectValue
          placeholder={intl.formatMessage({
            id: "litigation.litigation.selectLawyerPlaceholder",
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
                id: "litigation.litigation.noLawyersFound",
              })}{" "}
            </SelectItem>
          ))}
        {data?.map((lawyer) => (
          <SelectItem key={lawyer.id} value={lawyer.id}>
            {lawyer.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
