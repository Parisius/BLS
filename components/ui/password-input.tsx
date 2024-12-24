"use client";

import * as React from "react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    const toggleVisible = useCallback(() => {
      setVisible((prev) => !prev);
    }, []);

    return (
      <div className="relative">
        <input
          className={cn(
            "peer flex h-10 w-full rounded-md border border-input bg-background py-2 pl-3 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
          type={visible ? "text" : "password"}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute bottom-1/2 right-3 translate-y-1/2 rounded-full peer-placeholder-shown:sr-only"
          onClick={toggleVisible}
        >
          {visible ? <Eye /> : <EyeOff />}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
