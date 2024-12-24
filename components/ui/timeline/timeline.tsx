"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes, useMemo } from "react";
import { TimelineContext } from "./timeline-context";

export const timelineVariants = cva(
  "[&>div]:relative [&>div]:flex [&>div]:items-center [&>div]:gap-10 [&>div]:p-5",
  {
    variants: {
      orientation: {
        horizontal: "[&>div]:flex-row [&>div]:w-fit",
        vertical: "min-w-96 max-w-xl [&>div]:flex-col",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
);

interface TimelineProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineVariants> {
  className?: string;
  children: React.ReactNode;
  orientation?: "vertical" | "horizontal";
}

export const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, children, orientation, ...props }, ref) => {
    const contextValue = useMemo(
      () => ({ orientation: orientation ?? "vertical" }),
      [orientation]
    );

    return (
      <div
        ref={ref}
        {...props}
        className={cn(timelineVariants({ orientation }), className)}
      >
        <div>
          <TimelineContext.Provider value={contextValue}>
            {children}
          </TimelineContext.Provider>
        </div>
      </div>
    );
  }
);

Timeline.displayName = "Timeline";
