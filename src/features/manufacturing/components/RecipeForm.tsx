import React, { useState, useEffect } from 'react';
import { useManufacturingStore } from '../store/manufacturingStore';
import { useInventoryStore } from '../../inventory/store/inventoryStore';
import { X, Plus, Trash2 } from 'lucide-react';
import { Recipe, RecipeIngredient, RecipeInstruction } from '../models/manufacturing';
import { calculateRecipeCosting } from '../utils/costCalculator';

interface RecipeFormProps {
  onClose: () => void;
  recipe?: Recipe;
}

export function RecipeForm({ onClose, recipe }: RecipeFormProps) {
  const { addRecipe, updateRecipe } = useManufacturingStore();
  const { items: inventoryItems } = useInventoryStore();

  const [formData, setFormData] = useState<Partial<Recipe>>(
    recipe || {
      name: '',
      description: '',
      categoryId: '',
      version: '1.0',
      status: 'DRAFT',
      yieldQuantity: 1,
      yieldUnit: 'serving',
      servingSize: '1 serving',
      prepTimeMinutes: 0,
      cookTimeMinutes: 0,
      shelfLifeDays: 1,
      ingredients: [],
      instructions: [],
      costing: {
        ingredientsCost: 0,
        gasCost: 0,
        electricityCost: 0,
        waterCost: 0,
        labourCost: 0,
        packagingCost: 0,
        overheadCost: 0,
        totalCost: 0,
        sellingPrice: 0,
        costPerPortion: 0,
        grossProfit: 0,
        marginPercentage: 0
      }
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Calculate costing before saving
      const computedCosting = calculateRecipeCosting(
        formData.ingredients || [],
        formData.cookTimeMinutes || 0,
        formData.prepTimeMinutes || 0,
        formData.costing?.sellingPrice || 0,
        formData.yieldQuantity || 1,
        inventoryItems
      );

      const payload = {
        ...formData,
        costing: computedCosting
      };

      if (recipe?.id) {
        await updateRecipe(recipe.id, payload);
      } else {
        await addRecipe(payload as any);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save recipe:', error);
    }
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [
        ...(prev.ingredients || []),
        { id: `ing_${Date.now()}`, inventoryItemId: '', itemName: '', quantity: 0, unit: '', isOptional: false, costPerUnit: 0 }
      ]
    }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {recipe ? 'Edit Recipe' : 'Create New Recipe'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="recipe-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Basic Info</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Recipe Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Yield Qty</label>
                    <input
                      type="number"
                      value={formData.yieldQuantity}
                      onChange={e => setFormData({ ...formData, yieldQuantity: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Yield Unit</label>
                    <input
                      type="text"
                      value={formData.yieldUnit}
                      onChange={e => setFormData({ ...formData, yieldUnit: e.target.value })}
                      placeholder="e.g. portions, kg, pcs"
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prep Time (min)</label>
                    <input
                      type="number"
                      value={formData.prepTimeMinutes}
                      onChange={e => setFormData({ ...formData, prepTimeMinutes: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cook Time (min)</label>
                    <input
                      type="number"
                      value={formData.cookTimeMinutes}
                      onChange={e => setFormData({ ...formData, cookTimeMinutes: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-700 pb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Bill of Materials (BOM)</h3>
                  <button type="button" onClick={addIngredient} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center">
                    <Plus className="w-4 h-4 mr-1" /> Add Item
                  </button>
                </div>

                {formData.ingredients?.length === 0 ? (
                  <div className="text-sm text-slate-500 text-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-600">
                    No ingredients added yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.ingredients?.map((ing, index) => (
                      <div key={ing.id} className="flex gap-2 items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Ingredient Name"
                            value={ing.itemName}
                            onChange={(e) => {
                              const newIngs = [...(formData.ingredients || [])];
                              newIngs[index].itemName = e.target.value;
                              setFormData({ ...formData, ingredients: newIngs });
                            }}
                            className="w-full px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="w-20">
                          <input
                            type="number"
                            placeholder="Qty"
                            value={ing.quantity || ''}
                            onChange={(e) => {
                              const newIngs = [...(formData.ingredients || [])];
                              newIngs[index].quantity = Number(e.target.value);
                              setFormData({ ...formData, ingredients: newIngs });
                            }}
                            className="w-full px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="w-20">
                          <input
                            type="text"
                            placeholder="Unit"
                            value={ing.unit}
                            onChange={(e) => {
                              const newIngs = [...(formData.ingredients || [])];
                              newIngs[index].unit = e.target.value;
                              setFormData({ ...formData, ingredients: newIngs });
                            }}
                            className="w-full px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="w-20">
                          <input
                            type="number"
                            placeholder="Waste%"
                            value={ing.wastagePercentage || ''}
                            onChange={(e) => {
                              const newIngs = [...(formData.ingredients || [])];
                              newIngs[index].wastagePercentage = Number(e.target.value);
                              setFormData({ ...formData, ingredients: newIngs });
                            }}
                            className="w-full px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="w-20">
                          <input
                            type="number"
                            placeholder="Yield%"
                            value={ing.yieldPercentage || ''}
                            onChange={(e) => {
                              const newIngs = [...(formData.ingredients || [])];
                              newIngs[index].yieldPercentage = Number(e.target.value);
                              setFormData({ ...formData, ingredients: newIngs });
                            }}
                            className="w-full px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            const newIngs = [...(formData.ingredients || [])];
                            newIngs.splice(index, 1);
                            setFormData({ ...formData, ingredients: newIngs });
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="recipe-form"
            className="px-4 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Save Recipe
          </button>
        </div>
      </div>
    </div>
  );
}
