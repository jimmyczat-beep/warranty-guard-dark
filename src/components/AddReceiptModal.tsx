import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, ReceiptFormData } from "@/types/receipt";
import { Camera, Upload, Calendar } from "lucide-react";
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { toast } from "@/hooks/use-toast";

interface AddReceiptModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ReceiptFormData) => void;
  categories: Category[];
}

export function AddReceiptModal({ 
  open, 
  onClose, 
  onSubmit, 
  categories 
}: AddReceiptModalProps) {
  const [formData, setFormData] = useState<ReceiptFormData>({
    name: "",
    categoryId: "",
    warrantyDate: "",
    photo: undefined
  });
  const [isLoading, setIsLoading] = useState(false);

  const handlePhotoCapture = async () => {
    try {
      const photo = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      setFormData(prev => ({ ...prev, photo: photo.dataUrl }));
      toast({
        title: "Photo captured",
        description: "Receipt photo has been added successfully."
      });
    } catch (error) {
      console.error('Error taking photo:', error);
      toast({
        title: "Camera error",
        description: "Failed to capture photo. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePhotoSelect = async () => {
    try {
      const photo = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      setFormData(prev => ({ ...prev, photo: photo.dataUrl }));
      toast({
        title: "Photo selected",
        description: "Receipt photo has been added successfully."
      });
    } catch (error) {
      console.error('Error selecting photo:', error);
      toast({
        title: "Gallery error", 
        description: "Failed to select photo. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a receipt name.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.categoryId) {
      toast({
        title: "Missing information", 
        description: "Please select a category.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.warrantyDate) {
      toast({
        title: "Missing information",
        description: "Please select a warranty date.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        name: "",
        categoryId: "",
        warrantyDate: "",
        photo: undefined
      });
      onClose();
    } catch (error) {
      console.error('Error saving receipt:', error);
      toast({
        title: "Save error",
        description: "Failed to save receipt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Receipt</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Section */}
          <div className="space-y-2">
            <Label>Receipt Photo</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePhotoCapture}
                className="flex-1"
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePhotoSelect}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Photo
              </Button>
            </div>
            {formData.photo && (
              <div className="mt-2">
                <img 
                  src={formData.photo} 
                  alt="Receipt preview"
                  className="w-full h-32 object-cover rounded-lg border border-border"
                />
              </div>
            )}
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Receipt Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., iPhone 15 Pro"
            />
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select 
              value={formData.categoryId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Warranty Date */}
          <div className="space-y-2">
            <Label htmlFor="warrantyDate">Warranty End Date</Label>
            <div className="relative">
              <Input
                id="warrantyDate"
                type="date"
                value={formData.warrantyDate}
                onChange={(e) => setFormData(prev => ({ ...prev, warrantyDate: e.target.value }))}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Saving..." : "Save Receipt"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}