"use client";

import { forwardRef, useContext, HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { TimelineContext } from "./timeline-context";

export const timelineItemContentVariants = cva("row-start-1 text-sm", {
  variants: {
    variant: {
      outline:
        "relative border rounded-md p-2 bg-card after:absolute after:h-5 after:w-5 after:rounded-sm after:from-transparent after:via-card after:via-50% [&>div]:h-full",
      title: "flex items-center text-lg font-semibold text-center",
    },
    position: {
      top: "",
      bottom: "",
      left: "",
      right: "",
    },
    orientation: {
      vertical: "",
      horizontal: "",
    },
  },
  compoundVariants: [
    {
      variant: "outline",
      orientation: "vertical",
      className: "after:top-1/2 after:-translate-y-1/2 after:border-t max-w-56",
    },
    {
      variant: "outline",
      orientation: "horizontal",
      className:
        "after:left-1/2 after:-translate-x-1/2 after:border-r w-56 max-h-56 [&>div]:overflow-y-auto",
    },
    {
      variant: "outline",
      orientation: "vertical",
      position: "left",
      className:
        "after:right-0 after:translate-x-1/2 after:border-r after:rotate-45 after:bg-gradient-to-bl",
    },
    {
      variant: "outline",
      orientation: "vertical",
      position: "right",
      className:
        "after:left-0 after:-translate-x-1/2 after:border-l after:-rotate-45 after:bg-gradient-to-br",
    },
    {
      variant: "title",
      orientation: "vertical",
      position: "right",
      className: "justify-start",
    },
    {
      variant: "title",
      orientation: "vertical",
      position: "left",
      className: "justify-end",
    },
    {
      variant: "outline",
      orientation: "horizontal",
      position: "top",
      className:
        "after:bottom-0 after:translate-y-1/2 after:border-b after:rotate-45 after:bg-gradient-to-tl",
    },
    {
      variant: "outline",
      orientation: "horizontal",
      position: "bottom",
      className:
        "after:top-0 after:-translate-y-1/2 after:border-t after:-rotate-45 after:bg-gradient-to-bl",
    },
    {
      variant: "title",
      orientation: "horizontal",
      position: "top",
      className: "flex-col justify-end",
    },
    {
      variant: "title",
      orientation: "horizontal",
      position: "bottom",
      className: "flex-col justify-start",
    },
    {
      orientation: "horizontal",
      position: "top",
      className: "row-start-1",
    },
    {
      orientation: "horizontal",
      position: "bottom",
      className: "row-start-2",
    },
    {
      orientation: "vertical",
      position: "left",
      className: "col-start-1",
    },
    {
      orientation: "vertical",
      position: "right",
      className: "col-start-2",
    },
  ],
  defaultVariants: {
    variant: "outline",
    position: "left",
    orientation: "vertical",
  },
});

type TimelineItemContentProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof timelineItemContentVariants> & {
    children: React.ReactNode;
  };

interface TimelineContextType {
  orientation: "vertical" | "horizontal";
}

export const TimelineItemContent = forwardRef<
  HTMLDivElement,
  TimelineItemContentProps
>(({ className, variant, position, children, ...props }, ref) => {
  const { orientation } = useContext(TimelineContext) as TimelineContextType;

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        timelineItemContentVariants({ variant, orientation, position }),
        className
      )}
    >
      <div>{children}</div>
    </div>
  );
});

TimelineItemContent.displayName = "TimelineItemContent";
