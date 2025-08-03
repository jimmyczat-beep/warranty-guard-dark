import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, X } from "lucide-react";
import { Category } from "@/types/receipt";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  showExpired: boolean;
  onShowExpiredToggle: (show: boolean) => void;
  showExpiring: boolean;
  onShowExpiringToggle: (show: boolean) => void;
  categories: Category[];
  className?: string;
}

export function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  showExpired,
  onShowExpiredToggle,
  showExpiring,
  onShowExpiringToggle,
  categories,
  className
}: SearchAndFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const activeFiltersCount = selectedCategories.length + 
    (showExpired ? 1 : 0) + 
    (showExpiring ? 1 : 0);

  const clearAllFilters = () => {
    selectedCategories.forEach(id => onCategoryToggle(id));
    onShowExpiredToggle(false);
    onShowExpiringToggle(false);
  };

  return (
    <div className={className}>
      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search receipts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Button and Active Filters */}
      <div className="flex items-center gap-2">
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter Receipts</SheetTitle>
            </SheetHeader>

            <div className="space-y-6 py-4">
              {/* Categories Filter */}
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => onCategoryToggle(category.id)}
                      />
                      <label 
                        htmlFor={category.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warranty Status Filter */}
              <div>
                <h3 className="font-medium mb-3">Warranty Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="expiring"
                      checked={showExpiring}
                      onCheckedChange={onShowExpiringToggle}
                    />
                    <label 
                      htmlFor="expiring"
                      className="text-sm font-medium leading-none"
                    >
                      Expiring Soon (30 days)
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="expired"
                      checked={showExpired}
                      onCheckedChange={onShowExpiredToggle}
                    />
                    <label 
                      htmlFor="expired"
                      className="text-sm font-medium leading-none"
                    >
                      Expired
                    </label>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button 
                  variant="outline" 
                  onClick={clearAllFilters}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Active Filter Tags */}
        {searchQuery && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Search: {searchQuery}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => onSearchChange("")}
            />
          </Badge>
        )}
      </div>
    </div>
  );
}