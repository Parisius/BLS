"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllContractCategoryTypes } from "@/services/api-sdk/models/contract/contract-category";
import { useIntl } from "react-intl";

export function CategoryTypeSelectComponent({ category, className, ...props }) {
  const intl = useIntl();
  const { data, isLoading, isError } = useAllContractCategoryTypes(category);

  if (isError) {
    throw new Error(
      intl.formatMessage({ id: "contract.contract.errorLoadingCategoryTypes" })
    );
  }

  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        <SelectValue
          placeholder={intl.formatMessage({
            id: "contract.contract.categoryTypeSelectPlaceholder",
          })}
        />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {intl.formatMessage({ id: "contract.contract.loading" })}
          </SelectItem>
        )}
        {!data ||
          (data.length === 0 && (
            <SelectItem disabled value="__empty__">
              {intl.formatMessage({
                id: "contract.contract.noCategoryTypesFound",
              })}
            </SelectItem>
          ))}
        {data?.map(({ id, label }) => (
          <SelectItem key={id} value={id}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
