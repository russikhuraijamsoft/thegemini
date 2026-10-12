import { collection, query, getDocs, doc, setDoc, updateDoc, onSnapshot, where, orderBy } from 'firebase/firestore';
import { db } from '../../../core/firebase/firebaseConfig';
import { Recipe, ProductionOrder, RecipeStatus } from '../models/manufacturing';

class ManufacturingService {
  private recipesCollection = 'manufacturing_recipes';
  private ordersCollection = 'manufacturing_orders';

  async getRecipes(): Promise<Recipe[]> {
    if (!db) {
      return [
        {
          id: 'r1',
          name: 'Classic Burger Patty',
          description: 'Standard 200g beef patty',
          categoryId: 'meat',
          version: '1.0',
          status: 'ACTIVE',
          yieldQuantity: 10,
          yieldUnit: 'pcs',
          servingSize: '1 pc',
          prepTimeMinutes: 15,
          cookTimeMinutes: 10,
          shelfLifeDays: 3,
          ingredients: [
            { id: 'i1', inventoryItemId: 'inv1', itemName: 'Ground Beef', quantity: 2, unit: 'kg', isOptional: false, costPerUnit: 15 }
          ],
          instructions: [
            { step: 1, description: 'Mix beef with seasoning', timeMinutes: 5 },
            { step: 2, description: 'Form into patties', timeMinutes: 10 }
          ],
          costing: {
            ingredientsCost: 30,
            gasCost: 5.68,
            electricityCost: 1.00,
            waterCost: 0.50,
            labourCost: 10.00,
            packagingCost: 2.00,
            overheadCost: 5.00,
            totalCost: 54.18,
            sellingPrice: 130,
            costPerPortion: 5.418,
            grossProfit: 75.82,
            marginPercentage: 58.3
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }

    const q = query(collection(db, this.recipesCollection), orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe));
  }

  async getProductionOrders(): Promise<ProductionOrder[]> {
    if (!db) {
      return [
        {
          id: 'po1',
          recipeId: 'r1',
          recipeName: 'Classic Burger Patty',
          batchNumber: 'BCH-001',
          plannedQuantity: 50,
          unit: 'pcs',
          plannedDate: new Date().toISOString(),
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }

    const q = query(collection(db, this.ordersCollection), orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductionOrder));
  }

  async addRecipe(data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
    if (!db) throw new Error('Firebase not initialized');
    
    const id = `rec_${Date.now()}`;
    const now = new Date().toISOString();
    const newRecipe: Recipe = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    };

    await setDoc(doc(db, this.recipesCollection, id), newRecipe);
    return newRecipe;
  }

  async updateRecipe(id: string, data: Partial<Recipe>): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    await updateDoc(doc(db, this.recipesCollection, id), {
      ...data,
      updatedAt: new Date().toISOString()
    });
  }

  async addProductionOrder(data: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductionOrder> {
    if (!db) throw new Error('Firebase not initialized');

    const id = `po_${Date.now()}`;
    const now = new Date().toISOString();
    const newOrder: ProductionOrder = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    };

    await setDoc(doc(db, this.ordersCollection, id), newOrder);
    return newOrder;
  }

  async updateProductionOrder(id: string, data: Partial<ProductionOrder>): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    await updateDoc(doc(db, this.ordersCollection, id), {
      ...data,
      updatedAt: new Date().toISOString()
    });
  }
}

export const manufacturingService = new ManufacturingService();
