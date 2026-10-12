export type RecipeStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface RecipeIngredient {
  id: string;
  inventoryItemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  isOptional: boolean;
  alternativeItemIds?: string[];
  costPerUnit: number; // Snapshot of cost at recipe creation/update
  wastagePercentage?: number;
  yieldPercentage?: number;
}

export interface RecipeInstruction {
  step: number;
  description: string;
  timeMinutes?: number;
}

export interface RecipeCosting {
  ingredientsCost: number;
  gasCost: number; // Calculated from gas rate * cook time
  electricityCost: number; // Fixed allowance or calculated
  waterCost: number; // Fixed allowance for washing/rinsing
  labourCost: number;
  packagingCost: number;
  overheadCost: number;
  totalCost: number; // Sum of all costs
  sellingPrice: number;
  costPerPortion: number;
  grossProfit: number;
  marginPercentage: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  targetInventoryItemId?: string; // Optional link to the finished goods inventory item
  version: string;
  status: RecipeStatus;
  yieldQuantity: number;
  yieldUnit: string;
  servingSize: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  shelfLifeDays: number;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  costing: RecipeCosting;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductionStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface ProductionOrder {
  id: string;
  recipeId: string;
  recipeName: string;
  batchNumber: string;
  plannedQuantity: number;
  actualQuantity?: number;
  unit: string;
  plannedDate: string;
  status: ProductionStatus;
  wasteQuantity?: number;
  wasteReason?: string;
  qcStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  qcNotes?: string;
  totalCost?: number;
  unitCost?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface BillOfMaterial {
  id: string;
  recipeId: string;
  version: string;
  effectiveDate: string;
  endDate?: string;
  yieldPercentage: number;
  wastePercentage: number;
  isActive: boolean;
}
