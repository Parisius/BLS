"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Type addresses and press Enter (or comma) to add them as removable chips. Invalid ones are refused. */
export function EmailListInput({
  value,
  onChange,
  placeholder,
  invalidLabel,
  removeLabel,
  disabled,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  invalidLabel: string;
  removeLabel: string;
  disabled?: boolean;
}) {
  const [draft, setDraft] = useState("");
  const [invalid, setInvalid] = useState(false);

  const commit = () => {
    const address = draft.trim().replace(/,$/, "");
    if (!address) return;
    if (!EMAIL.test(address)) {
      setInvalid(true);
      return;
    }
    if (!value.includes(address)) onChange([...value, address]);
    setDraft("");
    setInvalid(false);
  };

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((address) => (
            <Badge key={address} variant="secondary" className="gap-1 pr-1">
              {address}
              <button
                type="button"
                aria-label={`${removeLabel} ${address}`}
                disabled={disabled}
                className="rounded-full p-0.5 hover:bg-background/60"
                onClick={() => onChange(value.filter((item) => item !== address))}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Input
        type="email"
        value={draft}
        disabled={disabled}
        placeholder={placeholder}
        className="h-12"
        aria-invalid={invalid}
        onChange={(e) => {
          setDraft(e.target.value);
          setInvalid(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          }
        }}
        // An address typed but not confirmed would otherwise be lost on submit.
        onBlur={commit}
      />
      {invalid && <p className="text-sm font-medium text-destructive">{invalidLabel}</p>}
    </div>
  );
}
