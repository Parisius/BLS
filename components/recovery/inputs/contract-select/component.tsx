"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllContracts } from "@/services/api-sdk/models/contract/contract";
import { useIntl } from "react-intl"; // Importez useIntl

export function ContractSelectComponent({ className, ...props }) {
  const intl = useIntl(); // Utilisez la hook useIntl
  const { data, isLoading, isError } = useAllContracts({
    filter: "recover_without_guarantee",
  });

  if (isError) {
    throw new Error("Failed to load contracts");
  }

  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        <SelectValue
          placeholder={intl.formatMessage({
            id: "recovery.selectContractPlaceholder",
          })}
        />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {intl.formatMessage({ id: "recovery.loading" })}
          </SelectItem>
        )}
        {!data ||
          (data.length === 0 && (
            <SelectItem disabled value="__empty__">
              {intl.formatMessage({ id: "recovery.noContractsFound" })}
            </SelectItem>
          ))}
        {data?.map((contract) => (
          <SelectItem key={contract.id} value={contract.id}>
            {contract.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
