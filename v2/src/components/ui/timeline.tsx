"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const TimelineContext = React.createContext<{ orientation: "vertical" | "horizontal" }>({
  orientation: "vertical",
});

const timelineVariants = cva(
  "[&>div]:relative [&>div]:flex [&>div]:items-center [&>div]:gap-10 [&>div]:p-5",
  {
    variants: {
      orientation: {
        horizontal: "[&>div]:flex-row [&>div]:w-fit",
        vertical: "min-w-96 max-w-xl [&>div]:flex-col",
      },
    },
    defaultVariants: { orientation: "vertical" },
  },
);

interface TimelineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineVariants> {}

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, children, orientation, ...props }, ref) => {
    const value = React.useMemo(() => ({ orientation: orientation ?? "vertical" as const }), [orientation]);
    return (
      <div ref={ref} {...props} className={cn(timelineVariants({ orientation }), className)}>
        <div>
          <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>
        </div>
      </div>
    );
  },
);
Timeline.displayName = "Timeline";

export const TimelineSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = React.useContext(TimelineContext);
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "absolute border-2 border-secondary",
          {
            "inset-y-0 left-1/2 -translate-x-1/2": orientation === "vertical",
            "inset-x-0 top-1/2 -translate-y-1/2": orientation === "horizontal",
          },
          className,
        )}
      />
    );
  },
);
TimelineSeparator.displayName = "TimelineSeparator";

export const TimelineItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { orientation } = React.useContext(TimelineContext);
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "relative grid w-full gap-10",
          { "grid-cols-2": orientation === "vertical", "grid-rows-2": orientation === "horizontal" },
          className,
        )}
      >
        {children}
      </div>
    );
  },
);
TimelineItem.displayName = "TimelineItem";

export const TimelineItemDot = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      {...props}
      className={cn(
        "absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary",
        className,
      )}
    />
  ),
);
TimelineItemDot.displayName = "TimelineItemDot";

const timelineItemContentVariants = cva("row-start-1 text-sm", {
  variants: {
    variant: {
      outline:
        "relative border rounded-md p-2 bg-card after:absolute after:h-5 after:w-5 after:rounded-sm after:from-transparent after:via-card after:via-50% [&>div]:h-full",
      title: "flex items-center text-lg font-semibold text-center",
    },
    position: { top: "", bottom: "", left: "", right: "" },
    orientation: { vertical: "", horizontal: "" },
  },
  compoundVariants: [
    { variant: "outline", orientation: "vertical", className: "after:top-1/2 after:-translate-y-1/2 after:border-t max-w-56" },
    { variant: "outline", orientation: "horizontal", className: "after:left-1/2 after:-translate-x-1/2 after:border-r w-56 max-h-56 [&>div]:overflow-y-auto" },
    { variant: "outline", orientation: "vertical", position: "left", className: "after:right-0 after:translate-x-1/2 after:border-r after:rotate-45 after:bg-gradient-to-bl" },
    { variant: "outline", orientation: "vertical", position: "right", className: "after:left-0 after:-translate-x-1/2 after:border-l after:-rotate-45 after:bg-gradient-to-br" },
    { variant: "title", orientation: "vertical", position: "right", className: "justify-start" },
    { variant: "title", orientation: "vertical", position: "left", className: "justify-end" },
    { variant: "outline", orientation: "horizontal", position: "top", className: "after:bottom-0 after:translate-y-1/2 after:border-b after:rotate-45 after:bg-gradient-to-tl" },
    { variant: "outline", orientation: "horizontal", position: "bottom", className: "after:top-0 after:-translate-y-1/2 after:border-t after:-rotate-45 after:bg-gradient-to-bl" },
    { variant: "title", orientation: "horizontal", position: "top", className: "flex-col justify-end" },
    { variant: "title", orientation: "horizontal", position: "bottom", className: "flex-col justify-start" },
    { orientation: "horizontal", position: "top", className: "row-start-1" },
    { orientation: "horizontal", position: "bottom", className: "row-start-2" },
    { orientation: "vertical", position: "left", className: "col-start-1" },
    { orientation: "vertical", position: "right", className: "col-start-2" },
  ],
  defaultVariants: { variant: "outline", position: "left", orientation: "vertical" },
});

type TimelineItemContentProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof timelineItemContentVariants>;

export const TimelineItemContent = React.forwardRef<HTMLDivElement, TimelineItemContentProps>(
  ({ className, variant, position, children, ...props }, ref) => {
    const { orientation } = React.useContext(TimelineContext);
    return (
      <div
        ref={ref}
        {...props}
        className={cn(timelineItemContentVariants({ variant, orientation, position }), className)}
      >
        <div>{children}</div>
      </div>
    );
  },
);
TimelineItemContent.displayName = "TimelineItemContent";

export const TimelineHead = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      className={cn(
        "place-center col-span-2 flex h-24 w-24 origin-top-left translate-x-1/2 rotate-45 items-center justify-center rounded-md bg-muted text-muted-foreground",
        className,
      )}
    >
      <div className="-rotate-45 text-center">{children}</div>
    </div>
  ),
);
TimelineHead.displayName = "TimelineHead";
