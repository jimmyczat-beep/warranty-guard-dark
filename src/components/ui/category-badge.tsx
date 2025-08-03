import * as React from "react";
import { cn } from "@/lib/utils";
import { CategoryColor } from "@/types/receipt";

interface CategoryBadgeProps {
  color: CategoryColor;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colorClasses: Record<CategoryColor, string> = {
  electronics: "bg-category-electronics",
  home: "bg-category-home", 
  automotive: "bg-category-automotive",
  clothing: "bg-category-clothing",
  food: "bg-category-food",
  medical: "bg-category-medical",
  other: "bg-category-other"
};

const sizeClasses = {
  sm: "h-2 w-2 text-xs",
  md: "h-3 w-3 text-sm", 
  lg: "h-4 w-4 text-base"
};

export function CategoryBadge({ 
  color, 
  name, 
  size = "md", 
  className 
}: CategoryBadgeProps) {
  return (
    <div className={cn(
      "flex items-center gap-2",
      className
    )}>
      <div className={cn(
        "rounded-full",
        colorClasses[color],
        sizeClasses[size]
      )} />
      <span className={cn(
        "text-muted-foreground font-medium",
        size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"
      )}>
        {name}
      </span>
    </div>
  );
}