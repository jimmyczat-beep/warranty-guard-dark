export interface Receipt {
  id: string;
  name: string;
  category: Category;
  warrantyDate: string;
  photoPath: string;
  thumbnailPath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: CategoryColor;
}

export type CategoryColor = 
  | 'electronics'
  | 'home' 
  | 'automotive'
  | 'clothing'
  | 'food'
  | 'medical'
  | 'other';

export interface ReceiptFormData {
  name: string;
  categoryId: string;
  warrantyDate: string;
  photo?: string;
}

export const defaultCategories: Category[] = [
  { id: '1', name: 'Electronics', color: 'electronics' },
  { id: '2', name: 'Home & Garden', color: 'home' },
  { id: '3', name: 'Automotive', color: 'automotive' },
  { id: '4', name: 'Clothing', color: 'clothing' },
  { id: '5', name: 'Food & Groceries', color: 'food' },
  { id: '6', name: 'Medical', color: 'medical' },
  { id: '7', name: 'Other', color: 'other' }
];