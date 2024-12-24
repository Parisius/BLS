import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useId } from "react";
import { cn } from "@/lib/utils";

interface RadioFieldProps {
  className?: string;
  [x: string]: any;
}

export function RadioField({ className = "", ...field }: RadioFieldProps) {
  const yesRadioId = useId();
  const noRadioId = useId();

  return (
    <RadioGroup
      {...field}
      className={cn("flex items-center gap-5", className)} // Combine classes
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value="yes" id={yesRadioId} />
        <Label htmlFor={yesRadioId}>Oui</Label>
      </div>

      <div className="flex items-center gap-2">
        <RadioGroupItem value="no" id={noRadioId} />
        <Label htmlFor={noRadioId}>Non</Label>
      </div>
    </RadioGroup>
  );
}
