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
import { useAllLitigationParties } from "@/services/api-sdk/models/litigation/litigation-party";
import AddLitigationPartyDialog from "@/components/litigation/modals/add-litigation-party-dialog";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { useIntl } from "react-intl";

export function LitigationPartySelectComponent({ className, ...props }) {
  const { data, isLoading, isError } = useAllLitigationParties();
  const { formatMessage } = useIntl();

  if (isError) {
    throw new Error("Failed to load litigation parties");
  }

  const individualParties = useMemo(
    () => data?.filter((party) => party.type === "individual"),
    [data]
  );

  const corporateParties = useMemo(
    () => data?.filter((party) => party.type === "legal"),
    [data]
  );

  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        <SelectValue
          placeholder={formatMessage({
            id: "litigation.litigation.partySelect.placeholder",
          })}
        />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem disabled value="__loading__">
            {formatMessage({ id: "litigation.litigation.partySelect.loading" })}
          </SelectItem>
        )}
        {!data ||
          (data.length === 0 && (
            <SelectItem disabled value="__empty__">
              {formatMessage({ id: "litigation.litigation.partySelect.empty" })}
            </SelectItem>
          ))}
        <AddLitigationPartyDialog>
          <SelectItem disabled value="__add__">
            <span className="inline-flex items-center gap-2">
              <Plus size={16} />
              {formatMessage({
                id: "litigation.litigation.partySelect.addButton",
              })}
            </span>
          </SelectItem>
        </AddLitigationPartyDialog>

        {/* Individuals Group */}
        <SelectGroup>
          <SelectLabel>
            {formatMessage({
              id: "litigation.litigation.partySelect.individualLabel",
            })}
          </SelectLabel>
          {!individualParties ||
            (individualParties.length === 0 && (
              <SelectItem disabled value="__empty__" className="ml-5">
                {formatMessage({
                  id: "litigation.litigation.partySelect.individualEmpty",
                })}
              </SelectItem>
            ))}
          {individualParties?.map((party) => (
            <SelectItem key={party.id} value={party.id} className="ml-5">
              {party.title}
            </SelectItem>
          ))}
        </SelectGroup>

        {/* Legal Entities Group */}
        <SelectGroup>
          <SelectLabel>
            {formatMessage({
              id: "litigation.litigation.partySelect.corporateLabel",
            })}
          </SelectLabel>
          {!corporateParties ||
            (corporateParties.length === 0 && (
              <SelectItem disabled value="__empty__" className="ml-5">
                {formatMessage({
                  id: "litigation.litigation.partySelect.corporateEmpty",
                })}
              </SelectItem>
            ))}
          {corporateParties?.map((party) => (
            <SelectItem key={party.id} value={party.id} className="ml-5">
              {party.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
