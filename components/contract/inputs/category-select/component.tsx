"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllContractCategories } from "@/services/api-sdk/models/contract/contract-category";
import { useIntl } from "react-intl";

export function CategorySelectComponent({ className, ...props }) {
  const intl = useIntl();
  const { data, isLoading, isError } = useAllContractCategories();

  if (isError) {
    throw new Error(
      intl.formatMessage({ id: "contract.contract.errorLoadingCategories" })
    );
  }

  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        <SelectValue
          placeholder={intl.formatMessage({
            id: "contract.contract.categorySelectPlaceholder",
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
                id: "contract.contract.noCategoriesFound",
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
