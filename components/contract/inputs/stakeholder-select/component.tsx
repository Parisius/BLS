"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllStakeholders } from "@/services/api-sdk/models/contract/stakeholder";
import { Plus } from "lucide-react";
import AddStakeholderDialog from "@/components/contract/modals/add-stakeholder-dialog";
import { useMemo } from "react";
import { useIntl } from "react-intl";

export function StakeholderSelectComponent({ className, ...props }) {
  const { data, isLoading, isError } = useAllStakeholders();
  const intl = useIntl(); // Utilisez le hook useIntl pour les traductions

  if (isError) {
    throw new Error("Failed to load stakeholders");
  }

  const individualStakeholders = useMemo(
    () => data?.filter((stakeholder) => stakeholder.type === "individual"),
    [data]
  );

  const corporateStakeholders = useMemo(
    () => data?.filter((stakeholder) => stakeholder.type === "corporate"),
    [data]
  );

  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        <SelectValue
          placeholder={intl.formatMessage({
            id: "contract.stakeholder.select.placeholder",
          })}
        />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {intl.formatMessage({ id: "contract.stakeholder.select.loading" })}
          </SelectItem>
        )}
        {!isLoading && !isError && (
          <AddStakeholderDialog>
            <SelectItem disabled value="__add__">
              <span className="inline-flex items-center gap-2">
                <Plus size={16} />
                {intl.formatMessage({
                  id: "contract.stakeholder.select.addMember",
                })}
              </span>
            </SelectItem>
          </AddStakeholderDialog>
        )}
        <SelectGroup>
          <SelectLabel>
            {intl.formatMessage({
              id: "contract.stakeholder.select.individuals",
            })}
          </SelectLabel>
          {!individualStakeholders ||
            (individualStakeholders.length === 0 && (
              <SelectItem disabled value="__empty__" className="ml-5">
                {intl.formatMessage({
                  id: "contract.stakeholder.select.noIndividuals",
                })}
              </SelectItem>
            ))}
          {individualStakeholders?.map((stakeholder) => (
            <SelectItem
              key={stakeholder.id}
              value={stakeholder.id}
              className="ml-5"
            >
              {stakeholder.name}
            </SelectItem>
          ))}
        </SelectGroup>

        <SelectGroup>
          <SelectLabel>
            {intl.formatMessage({
              id: "contract.stakeholder.select.corporates",
            })}
          </SelectLabel>
          {!corporateStakeholders ||
            (corporateStakeholders.length === 0 && (
              <SelectItem disabled value="__empty__" className="ml-5">
                {intl.formatMessage({
                  id: "contract.stakeholder.select.noCorporates",
                })}
              </SelectItem>
            ))}
          {corporateStakeholders?.map((stakeholder) => (
            <SelectItem
              key={stakeholder.id}
              value={stakeholder.id}
              className="ml-5"
            >
              {stakeholder.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
