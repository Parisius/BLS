import { cn } from "@/lib/utils";

type TextFieldProps = {
  className?: string;
  disabled?: boolean;
  onChange?: (...event: any[]) => void;
  onBlur?: () => void;
  value?: any;
  name?: string;
  ref?: any;
  [key: string]: any;
};

export function TextField({ className = "", ...field }: TextFieldProps) {
  return <input type="text" className={cn("h-12", className)} {...field} />;
}
