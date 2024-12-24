import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TimelineItemDotProps extends HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

export const TimelineItemDot = forwardRef<
  HTMLSpanElement,
  TimelineItemDotProps
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    {...props}
    className={cn(
      "absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary",
      className
    )}
  />
));

TimelineItemDot.displayName = "TimelineItemDot";
