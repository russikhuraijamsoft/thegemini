import { create } from 'zustand';
import { Recipe, ProductionOrder, RecipeStatus } from '../models/manufacturing';
import { manufacturingService } from '../services/manufacturingService';
import { inventoryService } from '../../inventory/services/inventoryService';

interface ManufacturingState {
  recipes: Recipe[];
  productionOrders: ProductionOrder[];
  loading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRecipe: (id: string, data: Partial<Recipe>) => Promise<void>;
  addProductionOrder: (order: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProductionOrder: (id: string, data: Partial<ProductionOrder>) => Promise<void>;
  completeProductionOrder: (id: string, actualQuantity: number, wasteQuantity: number, qcStatus: 'APPROVED' | 'REJECTED') => Promise<void>;
}

export const useManufacturingStore = create<ManufacturingState>((set, get) => ({
  recipes: [],
  productionOrders: [],
  loading: false,
  error: null,

  loadData: async () => {
    set({ loading: true, error: null });
    try {
      const [recipes, productionOrders] = await Promise.all([
        manufacturingService.getRecipes(),
        manufacturingService.getProductionOrders()
      ]);
      set({ recipes, productionOrders, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to load manufacturing data', loading: false });
    }
  },

  addRecipe: async (recipe) => {
    try {
      const newRecipe = await manufacturingService.addRecipe(recipe);
      set(state => ({ recipes: [newRecipe, ...state.recipes] }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateRecipe: async (id, data) => {
    try {
      await manufacturingService.updateRecipe(id, data);
      set(state => ({
        recipes: state.recipes.map(r => r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r)
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  addProductionOrder: async (order) => {
    try {
      const newOrder = await manufacturingService.addProductionOrder(order);
      set(state => ({ productionOrders: [newOrder, ...state.productionOrders] }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateProductionOrder: async (id, data) => {
    try {
      await manufacturingService.updateProductionOrder(id, data);
      set(state => ({
        productionOrders: state.productionOrders.map(o => o.id === id ? { ...o, ...data, updatedAt: new Date().toISOString() } : o)
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  completeProductionOrder: async (id, actualQuantity, wasteQuantity, qcStatus) => {
    try {
      const { productionOrders, recipes } = get();
      const order = productionOrders.find(o => o.id === id);
      if (!order) throw new Error("Order not found");

      const recipe = recipes.find(r => r.id === order.recipeId);
      if (!recipe) throw new Error("Recipe not found");

      // Mark order complete
      const updates = { 
        status: 'COMPLETED' as const, 
        actualQuantity, 
        wasteQuantity, 
        qcStatus, 
        completedAt: new Date().toISOString() 
      };

      await manufacturingService.updateProductionOrder(id, updates);
      
      set(state => ({
        productionOrders: state.productionOrders.map(o => o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o)
      }));

      // Inventory Adjustments (if item ID logic exists)
      if (qcStatus === 'APPROVED') {
        const ratio = actualQuantity / recipe.yieldQuantity;

        // Deduct materials
        for (const ing of recipe.ingredients) {
          if (ing.inventoryItemId) {
            await inventoryService.recordTransaction({
              itemId: ing.inventoryItemId,
              type: 'STOCK_OUT',
              quantity: ing.quantity * ratio,
              referenceId: order.id,
              notes: `Consumed for Manufacturing Batch: ${order.batchNumber}`,
              unitCost: ing.costPerUnit || 0,
              totalCost: (ing.costPerUnit || 0) * (ing.quantity * ratio),
              performedBy: 'System'
            }).catch(console.error); // Catch individually to not break loop
          }
        }

        // Add finished goods
        if (recipe.targetInventoryItemId) {
          await inventoryService.recordTransaction({
            itemId: recipe.targetInventoryItemId,
            type: 'STOCK_IN',
            quantity: actualQuantity,
            referenceId: order.id,
            notes: `Manufactured via Batch: ${order.batchNumber}`,
            unitCost: recipe.costing?.totalCost / recipe.yieldQuantity || 0,
            totalCost: (recipe.costing?.totalCost / recipe.yieldQuantity || 0) * actualQuantity,
            performedBy: 'System'
          }).catch(console.error);
        }
      }

    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  }
}));
