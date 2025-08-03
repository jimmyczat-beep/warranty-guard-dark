import React, { useState, useMemo } from "react";
import { Plus, Search, MoreVertical } from "lucide-react";
import { MobileHeader } from "@/components/ui/mobile-header";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { ReceiptCard } from "@/components/ReceiptCard";
import { AddReceiptModal } from "@/components/AddReceiptModal";
import { SearchAndFilter } from "@/components/SearchAndFilter";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Receipt, Category, ReceiptFormData, defaultCategories } from "@/types/receipt";
import { Filesystem, Directory } from '@capacitor/filesystem';
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [receipts, setReceipts] = useLocalStorage<Receipt[]>("receipts", []);
  const [categories] = useLocalStorage<Category[]>("categories", defaultCategories);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showExpired, setShowExpired] = useState(false);
  const [showExpiring, setShowExpiring] = useState(false);

  // Filter receipts based on search and filters
  const filteredReceipts = useMemo(() => {
    return receipts.filter(receipt => {
      // Search filter
      if (searchQuery && !receipt.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(receipt.category.id)) {
        return false;
      }

      // Warranty status filter
      const warrantyDate = new Date(receipt.warrantyDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((warrantyDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (showExpired && daysUntilExpiry >= 0) return false;
      if (showExpiring && (daysUntilExpiry < 0 || daysUntilExpiry > 30)) return false;

      return true;
    });
  }, [receipts, searchQuery, selectedCategories, showExpired, showExpiring]);

  const handleAddReceipt = async (formData: ReceiptFormData) => {
    try {
      const category = categories.find(c => c.id === formData.categoryId);
      if (!category) throw new Error("Category not found");

      let photoPath = "";
      
      // Save photo to device storage if provided
      if (formData.photo) {
        const fileName = `receipt_${Date.now()}.jpg`;
        const result = await Filesystem.writeFile({
          path: fileName,
          data: formData.photo,
          directory: Directory.Data,
        });
        photoPath = result.uri;
      }

      const newReceipt: Receipt = {
        id: Date.now().toString(),
        name: formData.name,
        category,
        warrantyDate: formData.warrantyDate,
        photoPath,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setReceipts(prev => [newReceipt, ...prev]);
      
      toast({
        title: "Receipt saved",
        description: "Your receipt has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving receipt:", error);
      throw error;
    }
  };

  const handleReceiptClick = (receipt: Receipt) => {
    // TODO: Navigate to receipt details page
    console.log("Clicked receipt:", receipt);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <MobileHeader
        title="My Receipts"
        rightAction={
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-5 w-5" />
          </Button>
        }
      />

      {/* Content */}
      <div className="px-4 py-4 space-y-4">
        {/* Search and Filter */}
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          showExpired={showExpired}
          onShowExpiredToggle={setShowExpired}
          showExpiring={showExpiring}
          onShowExpiringToggle={setShowExpiring}
          categories={categories}
        />

        {/* Receipts List */}
        <div className="space-y-3">
          {filteredReceipts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {receipts.length === 0 ? "No receipts yet" : "No receipts found"}
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                {receipts.length === 0 
                  ? "Start building your receipt collection by adding your first receipt."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {receipts.length === 0 && (
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Receipt
                </Button>
              )}
            </div>
          ) : (
            filteredReceipts.map((receipt) => (
              <ReceiptCard
                key={receipt.id}
                receipt={receipt}
                onClick={handleReceiptClick}
              />
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setIsAddModalOpen(true)}>
        <Plus className="h-6 w-6" />
      </FloatingActionButton>

      {/* Add Receipt Modal */}
      <AddReceiptModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddReceipt}
        categories={categories}
      />
    </div>
  );
};

export default Index;
