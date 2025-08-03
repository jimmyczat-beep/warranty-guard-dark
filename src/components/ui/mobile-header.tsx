import * as React from "react";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  title: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  className?: string;
}

export function MobileHeader({ 
  title, 
  leftAction, 
  rightAction, 
  className 
}: MobileHeaderProps) {
  return (
    <header className={cn(
      "sticky top-0 z-40 flex h-header items-center justify-between",
      "bg-background/80 backdrop-blur-md border-b border-border px-4",
      className
    )}>
      <div className="flex items-center">
        {leftAction}
      </div>
      
      <h1 className="flex-1 text-center text-lg font-semibold text-foreground truncate mx-4">
        {title}
      </h1>
      
      <div className="flex items-center">
        {rightAction}
      </div>
    </header>
  );
}