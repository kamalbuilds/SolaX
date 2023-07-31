"use client";
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "../../utils/elusiv";
import { BadgeCheck, CircleDollarSign } from "lucide-react";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <div
    className={cn(
      "relative h-3 rounded-full bg-secondary sm:w-220 lg:w-300",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Root
      ref={ref}
      className="h-full w-full overflow-hidden rounded-full relative"
    >
      <ProgressPrimitive.Indicator
        className={`h-full flex-1 transition-all mr-2 rounded-full ${
          value !== undefined && value !== null && value >= 100
            ? "bg-green-500"
            : "bg-brand"
        }`}
        style={{
          transform: `translateX(${
            value ? (100 - value > 100 ? 0 : -(100 - value)) : 0
          }%)`,
        }}
      />
    </ProgressPrimitive.Root>
    {value && value > 1 && (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${value}%`,
          transform: "translate(-100%, -50%)",
        }}
      >
        <CircleDollarSign
          style={{
            color: "#ffffff",
            height: "30px",
            width: "30px",
            zIndex: 10,
          }}
          fill={value !== undefined && value !== null && value >= 100 ? "#10B981" : "#6D14FF"} // Change here
        />
      </div>
    )}
  </div>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
