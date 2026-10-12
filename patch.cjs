const fs = require('fs');
const content = fs.readFileSync('src/features/manufacturing/components/RecipeForm.tsx', 'utf8');

const target = '          </form>\n        </div>\n        <div className="px-6 py-4 border-t';
const replacement = `          </form>

          {/* Real-time Cost Calculation Display */}
          <div className="mt-6 bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Cost Analysis Estimate</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Selling Price</label>
              <div className="flex gap-4 items-center">
                <input
                  type="number"
                  value={formData.costing?.sellingPrice || 0}
                  onChange={(e) => setFormData({ ...formData, costing: { ...formData.costing, sellingPrice: Number(e.target.value) } as any })}
                  className="w-48 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {(() => {
              const liveCosting = calculateRecipeCosting(
                formData.ingredients || [],
                formData.cookTimeMinutes || 0,
                formData.prepTimeMinutes || 0,
                formData.costing?.sellingPrice || 0,
                inventoryItems
              );
              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 mb-1">Ingredients Cost</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">₹{liveCosting.ingredientsCost.toFixed(2)}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 mb-1">Utility Cost (Gas/Water)</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">₹{(liveCosting.gasCost + liveCosting.electricityCost + liveCosting.waterCost).toFixed(2)}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 mb-1">Total Cost</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">₹{liveCosting.totalCost.toFixed(2)}</p>
                  </div>
                  <div className={\`p-3 rounded-lg border \${liveCosting.marginPercentage > 20 ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}\`}>
                    <p className="text-xs text-slate-500 mb-1">Gross Margin</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{liveCosting.marginPercentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
        <div className="px-6 py-4 border-t`;

fs.writeFileSync('src/features/manufacturing/components/RecipeForm.tsx', content.replace(target, replacement));
