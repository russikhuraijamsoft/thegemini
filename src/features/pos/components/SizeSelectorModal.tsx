import React, { useState } from 'react';
import { Product, ItemSize } from '../models/pos';
import { X, Plus, Minus, Check } from 'lucide-react';

interface SizeSelectorModalProps {
  product: Product;
  onClose: () => void;
  onConfirm: (product: Product, size: ItemSize, selectedOption?: string, quantity?: number) => void;
}

export function SizeSelectorModal({ product, onClose, onConfirm }: SizeSelectorModalProps) {
  const activeSizes = (product.sizes || []).filter(s => s.active !== false);

  // Default to first active size (or 'Medium' if available, else first)
  const defaultSize = activeSizes.find(s => s.size === 'Medium')?.size || activeSizes[0]?.size || 'Standard';
  const [selectedSize, setSelectedSize] = useState<ItemSize>(defaultSize);
  const [quantity, setQuantity] = useState<number>(1);

  // If this item is a combo with a choice option (e.g. Signature Combo: Medium Chowmein OR Fried Rice)
  const choiceComponent = product.comboComponents?.find(c => c.isChoice && c.options && c.options.length > 0);
  const [selectedComboOption, setSelectedComboOption] = useState<string>(
    choiceComponent?.options?.[0]?.name || ''
  );

  const currentSizeObj = activeSizes.find(s => s.size === selectedSize);
  const unitPrice = currentSizeObj ? currentSizeObj.price : product.price;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    onConfirm(
      product, 
      selectedSize, 
      choiceComponent ? selectedComboOption : undefined, 
      quantity
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white border-2 border-[#ebd5da] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-[#800000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#800000] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#fbe6ea]">
              {product.category}
            </span>
            <h3 className="text-xl font-black text-white leading-tight mt-0.5">
              {product.name}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Combo Option Choice (if applicable) */}
          {choiceComponent && choiceComponent.options && (
            <div>
              <label className="block text-xs uppercase font-black tracking-wider text-[#800000] mb-2.5">
                Select Base Choice:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {choiceComponent.options.map((opt) => {
                  const isSelected = selectedComboOption === opt.name;
                  return (
                    <button
                      key={opt.itemId}
                      type="button"
                      onClick={() => setSelectedComboOption(opt.name)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all font-bold text-left ${
                        isSelected 
                          ? 'border-[#800000] bg-[#fdf5f6] text-[#800000] shadow-xs' 
                          : 'border-[#ebd5da] hover:border-[#800000]/40 text-[#800000]/80'
                      }`}
                    >
                      <span className="text-sm">{opt.name}</span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#800000] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {activeSizes.length > 1 && (
            <div>
              <label className="block text-xs uppercase font-black tracking-wider text-[#800000] mb-2.5">
                Select Size:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {activeSizes.map((s) => {
                  const isSelected = selectedSize === s.size;
                  return (
                    <button
                      key={s.size}
                      type="button"
                      onClick={() => setSelectedSize(s.size)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-[#800000] bg-[#800000] text-white shadow-sm' 
                          : 'border-[#ebd5da] bg-white text-[#800000] hover:border-[#800000] hover:bg-[#fdf5f6]'
                      }`}
                    >
                      <span className={`text-xs uppercase font-black tracking-wider ${isSelected ? 'text-white' : 'text-[#800000]'}`}>
                        {s.size}
                      </span>
                      <span className={`text-base font-black mt-1 ${isSelected ? 'text-white' : 'text-[#800000]'}`}>
                        ₹{s.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between pt-2 border-t border-[#ebd5da]">
            <span className="text-sm font-black text-[#800000]">Quantity</span>
            <div className="flex items-center space-x-3 bg-[#fdf5f6] border border-[#ebd5da] rounded-xl p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-[#ebd5da] text-[#800000] flex items-center justify-center hover:bg-[#fee8eb] transition-colors disabled:opacity-40"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-black text-[#800000] text-base">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-white border border-[#ebd5da] text-[#800000] flex items-center justify-center hover:bg-[#fee8eb] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#fdf5f6] border-t border-[#ebd5da] flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-[#ebd5da] bg-white font-bold text-[#800000] hover:bg-[#fee8eb] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-2 py-3 px-4 rounded-xl bg-[#800000] hover:bg-[#680016] text-white font-black transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <span>Add to Order</span>
            <span>•</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
