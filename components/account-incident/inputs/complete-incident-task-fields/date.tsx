import { DateInput } from "@/components/ui/date-input";
import { cn } from "@/lib/utils";

type DateFieldProps = {
  className?: string;
  wrapperClassName?: string;
  value: Date | null;
  onChange?: (date: Date | null) => void;
  [key: string]: any;
};

export function DateField({ className = "", value, ...field }: DateFieldProps) {
  return (
    <DateInput value={value} {...field} className={cn("h-12", className)} />
  );
}
