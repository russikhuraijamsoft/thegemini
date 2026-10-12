import { describe, it, expect } from 'vitest';
import { 
  calculateIngredientCost, 
  calculateRecipeCosting, 
  calculateBatchCost, 
  calculateSellingPriceRecommendation, 
  calculateCostVariance,
  calculateProfitAnalysis 
} from '../features/manufacturing/utils/costCalculator';

describe('Manufacturing Cost Calculator', () => {
  it('calculates ingredient cost accurately with explicit costPerUnit', () => {
    const ingredient = {
      itemName: 'Ground Beef',
      quantity: 2.5,
      unit: 'kg',
      costPerUnit: 20
    };
    const cost = calculateIngredientCost(ingredient);
    expect(cost).toBe(50);
  });

  it('calculates ingredient cost using fallback assumptions when costPerUnit is not provided', () => {
    const ingredient = {
      itemName: 'Raw Chicken Breast',
      quantity: 500, // 500g
      unit: 'g'
    };
    const cost = calculateIngredientCost(ingredient);
    expect(cost).toBe(125); // (250 / 1000) * 500 = 125
  });

  it('computes complete recipe costing including utilities, overheads, and gross profit', () => {
    const ingredients = [
      { id: '1', inventoryItemId: 'inv_1', itemName: 'Chicken', quantity: 200, unit: 'g', costPerUnit: 0.25, isOptional: false }
    ];
    const costing = calculateRecipeCosting(
      ingredients,
      10, // cookTime
      5,  // prepTime
      200, // sellingPrice
      1   // yield
    );

    expect(costing.sellingPrice).toBe(200);
    expect(costing.ingredientsCost).toBeGreaterThan(50);
    expect(costing.totalCost).toBeGreaterThan(0);
    expect(costing.grossProfit).toBe(200 - costing.totalCost);
    expect(costing.marginPercentage).toBeCloseTo(((costing.grossProfit) / 200) * 100, 1);
  });

  it('scales batch costs properly with multiplier', () => {
    const mockRecipe: any = {
      yieldQuantity: 5,
      costing: {
        totalCost: 100
      }
    };
    const result = calculateBatchCost(mockRecipe, 20);
    expect(result.totalBatchCost).toBe(400);
    expect(result.unitCost).toBe(20);
  });

  it('calculates recommended selling price given food cost percentage', () => {
    const totalCost = 30;
    const targetPercent = 30; // 30%
    const recommendedPrice = calculateSellingPriceRecommendation(totalCost, targetPercent);
    expect(recommendedPrice).toBe(100);
  });

  it('computes cost variance and assesses favorability', () => {
    const favorable = calculateCostVariance(100, 80);
    expect(favorable.variance).toBe(20);
    expect(favorable.isFavorable).toBe(true);
    expect(favorable.variancePercentage).toBe(20);

    const unfavorable = calculateCostVariance(100, 120);
    expect(unfavorable.variance).toBe(-20);
    expect(unfavorable.isFavorable).toBe(false);
  });

  it('performs accurate period profit analysis', () => {
    const analysis = calculateProfitAnalysis(100, 50, 20);
    expect(analysis.totalRevenue).toBe(5000);
    expect(analysis.totalCost).toBe(2000);
    expect(analysis.totalGrossProfit).toBe(3000);
    expect(analysis.marginPercent).toBe(60);
  });
});
