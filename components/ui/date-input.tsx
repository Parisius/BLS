import React from "react";
import { cn } from "@/lib/utils";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import { enUS } from "date-fns/locale/en-US";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("fr", fr);
registerLocale("en", enUS);

export function DateInput({
  className,
  wrapperClassName = "",
  value,
  ...props
}) {
  return (
    <ReactDatePicker
      selected={value}
      dateFormat="dd/MM/yyyy"
      wrapperClassName={cn("!flex", wrapperClassName)}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
