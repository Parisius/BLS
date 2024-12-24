import React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { Input } from "@/components/ui/input";

interface NumberInputProps extends Omit<NumericFormatProps, "onChange"> {
  onChange?: (value: number | undefined) => void;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ onChange, ...props }, ref) => (
    <NumericFormat
      thousandSeparator
      getInputRef={ref}
      customInput={Input}
      onValueChange={({ floatValue }, { source }) => {
        if (source === "event") {
          onChange?.(floatValue);
        }
      }}
      {...props}
    />
  )
);

NumberInput.displayName = "NumberInput";

export { NumberInput };
