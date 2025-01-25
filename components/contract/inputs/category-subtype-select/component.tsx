"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllContractCategorySubTypes } from "@/services/api-sdk/models/contract/contract-category";
import { useIntl } from "react-intl";

export function CategorySubTypeSelectComponent({
  categoryType,
  className,
  ...props
}) {
  const intl = useIntl();
  const { data, isLoading, isError } =
    useAllContractCategorySubTypes(categoryType);

  if (isError) {
    throw new Error(
      intl.formatMessage({
        id: "contract.contract.errorLoadingCategorySubTypes",
      })
    );
  }

  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        <SelectValue
          placeholder={intl.formatMessage({
            id: "contract.contract.categorySubTypeSelectPlaceholder",
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
                id: "contract.contract.noCategorySubTypesFound",
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
