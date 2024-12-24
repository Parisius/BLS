"use client";

import { forwardRef, HTMLAttributes, useContext } from "react";
import { cn } from "@/lib/utils";
import { TimelineContext } from "./timeline-context";

interface TimelineItemProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

interface TimelineContextType {
  orientation: "vertical" | "horizontal";
}

export const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ className, children, ...props }, ref) => {
    const { orientation } = useContext(TimelineContext) as TimelineContextType;

    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "relative grid w-full gap-10",
          {
            "grid-cols-2": orientation === "vertical",
            "grid-rows-2": orientation === "horizontal",
          },
          className
        )}
      >
        {children}
      </div>
    );
  }
);

TimelineItem.displayName = "TimelineItem";
