"use client";
import { Tag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIntl } from "react-intl";

export default function PartiesGroupView({
  label,
  partiesGroup,
  className,
}: {
  label?: string;
  partiesGroup?: any;
  className?: string;
}) {
  const intl = useIntl();

  return (
    <div
      className={cn(
        "relative flex flex-col gap-5 rounded-xl border-2 p-5",
        className
      )}
    >
      {label && (
        <span className="absolute left-3 top-0 -translate-y-1/2 bg-background px-2 text-sm font-semibold">
          {label}
        </span>
      )}
      {partiesGroup.map(({ id, name, category, type }) => (
        <div key={id} className="flex gap-5">
          <div className="flex-1 space-y-2">
            <span>
              {intl.formatMessage({
                id: "litigation.litigation.parties.party",
              })}
            </span>{" "}
            <div className="flex items-center gap-2">
              <User className="flex-shrink-0" />
              <span>{name}</span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <span>
              {intl.formatMessage({
                id: "litigation.litigation.parties.category",
              })}
            </span>{" "}
            <div className="flex items-center gap-2">
              <Tag className="flex-shrink-0" />
              <span>{category}</span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <span>
              {intl.formatMessage({ id: "litigation.litigation.parties.type" })}
            </span>{" "}
            <div className="flex items-center gap-2">
              <Tag className="flex-shrink-0" />
              <span>{type}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
