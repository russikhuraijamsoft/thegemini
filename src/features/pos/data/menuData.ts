import { Product, MenuItemSize } from '../models/pos';

export const INITIAL_MENU_ITEMS: Product[] = [
  // ==================== CHOWMEIN ====================
  {
    id: 'prod_chow_veg',
    name: 'Veg Chowmein',
    category: 'Chowmein',
    price: 30, // Starting price
    isAvailable: true,
    active: true,
    costPrice: 15,
    sizes: [
      { item_id: 'prod_chow_veg', size: 'Small', price: 30, cost_price: 15, active: true },
      { item_id: 'prod_chow_veg', size: 'Medium', price: 45, cost_price: 22, active: true },
      { item_id: 'prod_chow_veg', size: 'Large', price: 70, cost_price: 32, active: true },
    ]
  },
  {
    id: 'prod_chow_egg',
    name: 'Egg Chowmein',
    category: 'Chowmein',
    price: 40,
    isAvailable: true,
    active: true,
    costPrice: 18,
    sizes: [
      { item_id: 'prod_chow_egg', size: 'Small', price: 40, cost_price: 18, active: true },
      { item_id: 'prod_chow_egg', size: 'Medium', price: 55, cost_price: 26, active: true },
      { item_id: 'prod_chow_egg', size: 'Large', price: 75, cost_price: 36, active: true },
    ]
  },
  {
    id: 'prod_chow_chicken',
    name: 'Chicken Chowmein',
    category: 'Chowmein',
    price: 45,
    isAvailable: true,
    active: true,
    costPrice: 22,
    sizes: [
      { item_id: 'prod_chow_chicken', size: 'Small', price: 45, cost_price: 22, active: true },
      { item_id: 'prod_chow_chicken', size: 'Medium', price: 70, cost_price: 34, active: true },
      { item_id: 'prod_chow_chicken', size: 'Large', price: 105, cost_price: 50, active: true },
    ]
  },
  {
    id: 'prod_chow_pork',
    name: 'Pork Chowmein',
    category: 'Chowmein',
    price: 55,
    isAvailable: true,
    active: true,
    costPrice: 28,
    sizes: [
      { item_id: 'prod_chow_pork', size: 'Small', price: 55, cost_price: 28, active: true },
      { item_id: 'prod_chow_pork', size: 'Medium', price: 90, cost_price: 45, active: true },
      { item_id: 'prod_chow_pork', size: 'Large', price: 135, cost_price: 65, active: true },
    ]
  },
  {
    id: 'prod_chow_mixed',
    name: 'Mixed Chowmein (Chicken+Pork)',
    category: 'Chowmein',
    price: 50,
    isAvailable: true,
    active: true,
    costPrice: 25,
    sizes: [
      { item_id: 'prod_chow_mixed', size: 'Small', price: 50, cost_price: 25, active: true },
      { item_id: 'prod_chow_mixed', size: 'Medium', price: 80, cost_price: 40, active: true },
      { item_id: 'prod_chow_mixed', size: 'Large', price: 120, cost_price: 58, active: true },
    ]
  },

  // ==================== FRIED RICE ====================
  {
    id: 'prod_fr_veg',
    name: 'Veg Fried Rice',
    category: 'Fried Rice',
    price: 30,
    isAvailable: true,
    active: true,
    costPrice: 14,
    sizes: [
      { item_id: 'prod_fr_veg', size: 'Small', price: 30, cost_price: 14, active: true },
      { item_id: 'prod_fr_veg', size: 'Medium', price: 45, cost_price: 21, active: true },
      { item_id: 'prod_fr_veg', size: 'Large', price: 60, cost_price: 28, active: true },
    ]
  },
  {
    id: 'prod_fr_egg',
    name: 'Egg Fried Rice',
    category: 'Fried Rice',
    price: 35,
    isAvailable: true,
    active: true,
    costPrice: 17,
    sizes: [
      { item_id: 'prod_fr_egg', size: 'Small', price: 35, cost_price: 17, active: true },
      { item_id: 'prod_fr_egg', size: 'Medium', price: 50, cost_price: 24, active: true },
      { item_id: 'prod_fr_egg', size: 'Large', price: 70, cost_price: 34, active: true },
    ]
  },
  {
    id: 'prod_fr_chicken',
    name: 'Chicken Fried Rice',
    category: 'Fried Rice',
    price: 40,
    isAvailable: true,
    active: true,
    costPrice: 20,
    sizes: [
      { item_id: 'prod_fr_chicken', size: 'Small', price: 40, cost_price: 20, active: true },
      { item_id: 'prod_fr_chicken', size: 'Medium', price: 65, cost_price: 32, active: true },
      { item_id: 'prod_fr_chicken', size: 'Large', price: 100, cost_price: 48, active: true },
    ]
  },
  {
    id: 'prod_fr_pork',
    name: 'Pork Fried Rice',
    category: 'Fried Rice',
    price: 55,
    isAvailable: true,
    active: true,
    costPrice: 28,
    sizes: [
      { item_id: 'prod_fr_pork', size: 'Small', price: 55, cost_price: 28, active: true },
      { item_id: 'prod_fr_pork', size: 'Medium', price: 85, cost_price: 42, active: true },
      { item_id: 'prod_fr_pork', size: 'Large', price: 130, cost_price: 62, active: true },
    ]
  },
  {
    id: 'prod_fr_mixed',
    name: 'Mixed Fried Rice (Chicken+Pork)',
    category: 'Fried Rice',
    price: 45,
    isAvailable: true,
    active: true,
    costPrice: 23,
    sizes: [
      { item_id: 'prod_fr_mixed', size: 'Small', price: 45, cost_price: 23, active: true },
      { item_id: 'prod_fr_mixed', size: 'Medium', price: 75, cost_price: 38, active: true },
      { item_id: 'prod_fr_mixed', size: 'Large', price: 115, cost_price: 56, active: true },
    ]
  },

  // ==================== CHILLY (Specials category, single size = Standard) ====================
  {
    id: 'prod_chilly_chicken_gravy',
    name: 'Chicken Chilly Gravy',
    category: 'Specials',
    price: 260,
    isAvailable: true,
    active: true,
    costPrice: 110,
    sizes: [
      { item_id: 'prod_chilly_chicken_gravy', size: 'Standard', price: 260, cost_price: 110, active: true }
    ]
  },
  {
    id: 'prod_chilly_chicken_dry',
    name: 'Chicken Chilly Dry',
    category: 'Specials',
    price: 250,
    isAvailable: true,
    active: true,
    costPrice: 105,
    sizes: [
      { item_id: 'prod_chilly_chicken_dry', size: 'Standard', price: 250, cost_price: 105, active: true }
    ]
  },
  {
    id: 'prod_chilly_pork_gravy',
    name: 'Pork Chilly Gravy',
    category: 'Specials',
    price: 290,
    isAvailable: true,
    active: true,
    costPrice: 125,
    sizes: [
      { item_id: 'prod_chilly_pork_gravy', size: 'Standard', price: 290, cost_price: 125, active: true }
    ]
  },
  {
    id: 'prod_chilly_pork_dry',
    name: 'Pork Chilly Dry',
    category: 'Specials',
    price: 280,
    isAvailable: true,
    active: true,
    costPrice: 120,
    sizes: [
      { item_id: 'prod_chilly_pork_dry', size: 'Standard', price: 280, cost_price: 120, active: true }
    ]
  },
  {
    id: 'prod_chilly_bites',
    name: 'Chilly Chicken Bites',
    category: 'Specials',
    price: 50,
    isAvailable: true,
    active: true,
    costPrice: 22,
    isSubItem: true,
    sizes: [
      { item_id: 'prod_chilly_bites', size: 'Standard', price: 50, cost_price: 22, active: true }
    ]
  },

  // ==================== COMBO MEALS ====================
  {
    id: 'prod_combo_duo',
    name: 'Duo Combo',
    category: 'Combo Meals',
    price: 75,
    isAvailable: true,
    active: true,
    costPrice: 42,
    isCombo: true,
    comboDescription: 'Small Chowmein + Small Fried Rice (Chicken)',
    sizes: [
      { item_id: 'prod_combo_duo', size: 'Standard', price: 75, cost_price: 42, active: true }
    ],
    comboComponents: [
      { itemId: 'prod_chow_chicken', name: 'Small Chicken Chowmein', size: 'Small', quantity: 1 },
      { itemId: 'prod_fr_chicken', name: 'Small Chicken Fried Rice', size: 'Small', quantity: 1 }
    ]
  },
  {
    id: 'prod_combo_signature',
    name: 'Signature Combo',
    category: 'Combo Meals',
    price: 110,
    isAvailable: true,
    active: true,
    costPrice: 56,
    isCombo: true,
    comboDescription: 'Medium Chowmein OR Fried Rice (Chicken) + Chilly Chicken Bites',
    sizes: [
      { item_id: 'prod_combo_signature', size: 'Standard', price: 110, cost_price: 56, active: true }
    ],
    comboComponents: [
      {
        itemId: 'choice_sig_base',
        name: 'Medium Chicken Chowmein or Fried Rice',
        quantity: 1,
        isChoice: true,
        options: [
          { itemId: 'prod_chow_chicken', name: 'Medium Chicken Chowmein', size: 'Medium' },
          { itemId: 'prod_fr_chicken', name: 'Medium Chicken Fried Rice', size: 'Medium' }
        ]
      },
      { itemId: 'prod_chilly_bites', name: 'Chilly Chicken Bites', size: 'Standard', quantity: 1 }
    ]
  },
  {
    id: 'prod_combo_family',
    name: 'Family Combo',
    category: 'Combo Meals',
    price: 330,
    isAvailable: true,
    active: true,
    costPrice: 155,
    isCombo: true,
    comboDescription: 'Large Chowmein OR Fried Rice (Chicken) + Full Chicken Chilly (Dry)',
    sizes: [
      { item_id: 'prod_combo_family', size: 'Standard', price: 330, cost_price: 155, active: true }
    ],
    comboComponents: [
      {
        itemId: 'choice_fam_base',
        name: 'Large Chicken Chowmein or Fried Rice',
        quantity: 1,
        isChoice: true,
        options: [
          { itemId: 'prod_chow_chicken', name: 'Large Chicken Chowmein', size: 'Large' },
          { itemId: 'prod_fr_chicken', name: 'Large Chicken Fried Rice', size: 'Large' }
        ]
      },
      { itemId: 'prod_chilly_chicken_dry', name: 'Full Chicken Chilly (Dry)', size: 'Standard', quantity: 1 }
    ]
  },

  // ==================== DEACTIVATED ITEMS (Retained for history, active: false) ====================
  // Momo
  {
    id: 'prod_momo_veg',
    name: 'Veg Momo',
    category: 'Momo',
    price: 50,
    isAvailable: false,
    active: false,
    costPrice: 20,
    sizes: [{ item_id: 'prod_momo_veg', size: 'Standard', price: 50, cost_price: 20, active: false }]
  },
  {
    id: 'prod_momo_chicken',
    name: 'Chicken Momo',
    category: 'Momo',
    price: 70,
    isAvailable: false,
    active: false,
    costPrice: 30,
    sizes: [{ item_id: 'prod_momo_chicken', size: 'Standard', price: 70, cost_price: 30, active: false }]
  },
  {
    id: 'prod_momo_pork',
    name: 'Pork Momo',
    category: 'Momo',
    price: 80,
    isAvailable: false,
    active: false,
    costPrice: 35,
    sizes: [{ item_id: 'prod_momo_pork', size: 'Standard', price: 80, cost_price: 35, active: false }]
  },
  {
    id: 'prod_momo_fried',
    name: 'Fried Momo',
    category: 'Momo',
    price: 75,
    isAvailable: false,
    active: false,
    costPrice: 32,
    sizes: [{ item_id: 'prod_momo_fried', size: 'Standard', price: 75, cost_price: 32, active: false }]
  },
  // Macaroni
  {
    id: 'prod_mac_veg',
    name: 'Veg Macaroni',
    category: 'Macaroni',
    price: 40,
    isAvailable: false,
    active: false,
    costPrice: 18,
    sizes: [{ item_id: 'prod_mac_veg', size: 'Standard', price: 40, cost_price: 18, active: false }]
  },
  {
    id: 'prod_mac_egg',
    name: 'Egg Macaroni',
    category: 'Macaroni',
    price: 50,
    isAvailable: false,
    active: false,
    costPrice: 22,
    sizes: [{ item_id: 'prod_mac_egg', size: 'Standard', price: 50, cost_price: 22, active: false }]
  },
  {
    id: 'prod_mac_chicken',
    name: 'Chicken Macaroni',
    category: 'Macaroni',
    price: 65,
    isAvailable: false,
    active: false,
    costPrice: 28,
    sizes: [{ item_id: 'prod_mac_chicken', size: 'Standard', price: 65, cost_price: 28, active: false }]
  },
  {
    id: 'prod_mac_pork',
    name: 'Pork Macaroni',
    category: 'Macaroni',
    price: 75,
    isAvailable: false,
    active: false,
    costPrice: 34,
    sizes: [{ item_id: 'prod_mac_pork', size: 'Standard', price: 75, cost_price: 34, active: false }]
  },
  // Stir Fry
  {
    id: 'prod_sf_veg',
    name: 'Veg Stir Fry',
    category: 'Stir Fry',
    price: 50,
    isAvailable: false,
    active: false,
    costPrice: 20,
    sizes: [{ item_id: 'prod_sf_veg', size: 'Standard', price: 50, cost_price: 20, active: false }]
  },
  {
    id: 'prod_sf_chicken',
    name: 'Chicken Stir Fry',
    category: 'Stir Fry',
    price: 80,
    isAvailable: false,
    active: false,
    costPrice: 35,
    sizes: [{ item_id: 'prod_sf_chicken', size: 'Standard', price: 80, cost_price: 35, active: false }]
  },
  {
    id: 'prod_sf_pork',
    name: 'Pork Stir Fry',
    category: 'Stir Fry',
    price: 90,
    isAvailable: false,
    active: false,
    costPrice: 40,
    sizes: [{ item_id: 'prod_sf_pork', size: 'Standard', price: 90, cost_price: 40, active: false }]
  },
  // Beverages
  {
    id: 'prod_bev_red_tea',
    name: 'Red Tea',
    category: 'Beverage',
    price: 15,
    isAvailable: false,
    active: false,
    costPrice: 4,
    sizes: [{ item_id: 'prod_bev_red_tea', size: 'Standard', price: 15, cost_price: 4, active: false }]
  },
  {
    id: 'prod_bev_black_coffee',
    name: 'Black Coffee',
    category: 'Beverage',
    price: 25,
    isAvailable: false,
    active: false,
    costPrice: 7,
    sizes: [{ item_id: 'prod_bev_black_coffee', size: 'Standard', price: 25, cost_price: 7, active: false }]
  },
  {
    id: 'prod_bev_coffee_latte',
    name: 'Coffee Latte',
    category: 'Beverage',
    price: 45,
    isAvailable: false,
    active: false,
    costPrice: 15,
    sizes: [{ item_id: 'prod_bev_coffee_latte', size: 'Standard', price: 45, cost_price: 15, active: false }]
  },
  {
    id: 'prod_bev_fruit_juice',
    name: 'Fruit Juice',
    category: 'Beverage',
    price: 50,
    isAvailable: false,
    active: false,
    costPrice: 18,
    sizes: [{ item_id: 'prod_bev_fruit_juice', size: 'Standard', price: 50, cost_price: 18, active: false }]
  },
  {
    id: 'prod_bev_fruit_shake',
    name: 'Fruit Shake',
    category: 'Beverage',
    price: 60,
    isAvailable: false,
    active: false,
    costPrice: 22,
    sizes: [{ item_id: 'prod_bev_fruit_shake', size: 'Standard', price: 60, cost_price: 22, active: false }]
  }
];

export const getAllMenuItemSizes = (): MenuItemSize[] => {
  const sizes: MenuItemSize[] = [];
  for (const item of INITIAL_MENU_ITEMS) {
    if (item.sizes) {
      for (const s of item.sizes) {
        sizes.push({
          ...s,
          id: `${s.item_id}_${s.size.toLowerCase()}`
        });
      }
    }
  }
  return sizes;
};
