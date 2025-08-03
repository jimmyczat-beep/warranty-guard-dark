import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const fabVariants = cva(
  "fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-fab transition-all duration-300 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-fab text-primary-foreground hover:shadow-lg",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      size: {
        default: "h-fab w-fab",
        sm: "h-12 w-12",
        lg: "h-16 w-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface FloatingActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fabVariants> {}

const FloatingActionButton = React.forwardRef<
  HTMLButtonElement,
  FloatingActionButtonProps
>(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(fabVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
FloatingActionButton.displayName = "FloatingActionButton";

export { FloatingActionButton, fabVariants };