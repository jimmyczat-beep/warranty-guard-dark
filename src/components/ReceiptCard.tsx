import React from "react";
import { Receipt } from "@/types/receipt";
import { CategoryBadge } from "@/components/ui/category-badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar, AlertTriangle, CheckCircle } from "lucide-react";

interface ReceiptCardProps {
  receipt: Receipt;
  onClick: (receipt: Receipt) => void;
  className?: string;
}

export function ReceiptCard({ receipt, onClick, className }: ReceiptCardProps) {
  const warrantyDate = new Date(receipt.warrantyDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((warrantyDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const getWarrantyStatus = () => {
    if (daysUntilExpiry < 0) return { status: 'expired', color: 'text-receipt-expired', icon: AlertTriangle };
    if (daysUntilExpiry <= 30) return { status: 'expiring', color: 'text-receipt-expiring', icon: AlertTriangle };
    return { status: 'valid', color: 'text-receipt-valid', icon: CheckCircle };
  };

  const { status, color, icon: StatusIcon } = getWarrantyStatus();

  return (
    <Card 
      className={cn(
        "bg-gradient-card shadow-receipt border-border/50",
        "p-4 cursor-pointer transition-all duration-300",
        "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      onClick={() => onClick(receipt)}
    >
      <div className="flex gap-3">
        {/* Photo Thumbnail */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden">
            {receipt.photoPath ? (
              <img 
                src={receipt.photoPath} 
                alt={receipt.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <span className="text-2xl">📄</span>
              </div>
            )}
          </div>
        </div>

        {/* Receipt Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm truncate mb-1">
            {receipt.name}
          </h3>
          
          <CategoryBadge 
            color={receipt.category.color}
            name={receipt.category.name}
            size="sm"
            className="mb-2"
          />
          
          <div className="flex items-center gap-1 text-xs">
            <Calendar className="h-3 w-3" />
            <span className="text-muted-foreground">
              {warrantyDate.toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Warranty Status */}
        <div className="flex-shrink-0 flex flex-col items-end">
          <StatusIcon className={cn("h-4 w-4 mb-1", color)} />
          <span className={cn("text-xs font-medium", color)}>
            {status === 'expired' ? 'Expired' : 
             status === 'expiring' ? `${daysUntilExpiry}d` : 
             'Valid'}
          </span>
        </div>
      </div>
    </Card>
  );
}