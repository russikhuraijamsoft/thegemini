import '../features/inventory/domain/inventory_deduction_engine.dart';
import '../features/kitchen/domain/kitchen_workflow.dart';
import '../features/pos/domain/pos_product.dart';

final defaultPosProducts = <PosProduct>[
  const PosProduct(
    id: 'prod_butter_chicken',
    name: 'Butter Chicken',
    categoryId: 'curries',
    pricePaise: 38000,
    variants: [
      PosProductVariant(size: PosItemSize.standard, pricePaise: 38000),
      PosProductVariant(size: PosItemSize.large, pricePaise: 54000),
    ],
  ),
  const PosProduct(
    id: 'prod_paneer_tikka',
    name: 'Paneer Tikka Masala',
    categoryId: 'curries',
    pricePaise: 32000,
    variants: [
      PosProductVariant(size: PosItemSize.standard, pricePaise: 32000),
      PosProductVariant(size: PosItemSize.large, pricePaise: 46000),
    ],
  ),
  const PosProduct(
    id: 'prod_biryani',
    name: 'Dum Biryani',
    categoryId: 'rice',
    pricePaise: 35000,
    variants: [
      PosProductVariant(size: PosItemSize.small, pricePaise: 22000),
      PosProductVariant(size: PosItemSize.standard, pricePaise: 35000),
      PosProductVariant(size: PosItemSize.large, pricePaise: 52000),
    ],
  ),
  const PosProduct(
    id: 'prod_dal_makhani',
    name: 'Dal Makhani',
    categoryId: 'curries',
    pricePaise: 26000,
  ),
  const PosProduct(
    id: 'prod_garlic_naan',
    name: 'Garlic Naan',
    categoryId: 'breads',
    pricePaise: 6500,
  ),
  const PosProduct(
    id: 'prod_masala_chai',
    name: 'Masala Chai',
    categoryId: 'beverages',
    pricePaise: 4000,
  ),
  const PosProduct(
    id: 'prod_mango_lassi',
    name: 'Mango Lassi',
    categoryId: 'beverages',
    pricePaise: 12000,
  ),
  const PosProduct(
    id: 'prod_gulab_jamun',
    name: 'Gulab Jamun (2 pcs)',
    categoryId: 'desserts',
    pricePaise: 9000,
  ),
];

final defaultInventoryItemNames = <String, String>{
  'inv_flour': 'All Purpose Flour',
  'inv_chicken': 'Fresh Chicken Breast',
  'inv_paneer': 'Fresh Paneer',
  'inv_rice': 'Basmati Rice',
  'inv_butter': 'Amul Butter',
  'inv_oil': 'Refined Oil',
};

final defaultInventoryItemUnits = <String, String>{
  'inv_flour': 'kg',
  'inv_chicken': 'kg',
  'inv_paneer': 'kg',
  'inv_rice': 'kg',
  'inv_butter': 'kg',
  'inv_oil': 'L',
};

InventoryState createDefaultInventoryState() {
  return InventoryState(
    branchId: TalkOsBranches.main,
    onHandMicros: {
      'inv_flour': 120000000, // 120 kg
      'inv_chicken': 45000000, // 45 kg
      'inv_paneer': 25000000,  // 25 kg
      'inv_rice': 80000000,    // 80 kg
      'inv_butter': 30000000,  // 30 kg
      'inv_oil': 60000000,     // 60 L
    },
    recipes: {
      'prod_butter_chicken': InventoryRecipe(
        productId: 'prod_butter_chicken',
        version: 1,
        ingredients: const [
          RecipeIngredient(inventoryItemId: 'inv_chicken', quantityMicrosPerServing: 250000),
          RecipeIngredient(inventoryItemId: 'inv_butter', quantityMicrosPerServing: 50000),
        ],
      ),
      'prod_paneer_tikka': InventoryRecipe(
        productId: 'prod_paneer_tikka',
        version: 1,
        ingredients: const [
          RecipeIngredient(inventoryItemId: 'inv_paneer', quantityMicrosPerServing: 200000),
          RecipeIngredient(inventoryItemId: 'inv_butter', quantityMicrosPerServing: 30000),
        ],
      ),
      'prod_biryani': InventoryRecipe(
        productId: 'prod_biryani',
        version: 1,
        ingredients: const [
          RecipeIngredient(inventoryItemId: 'inv_rice', quantityMicrosPerServing: 200000),
          RecipeIngredient(inventoryItemId: 'inv_oil', quantityMicrosPerServing: 30000),
        ],
      ),
      'prod_garlic_naan': InventoryRecipe(
        productId: 'prod_garlic_naan',
        version: 1,
        ingredients: const [
          RecipeIngredient(inventoryItemId: 'inv_flour', quantityMicrosPerServing: 150000),
          RecipeIngredient(inventoryItemId: 'inv_butter', quantityMicrosPerServing: 20000),
        ],
      ),
    },
    movements: const [
      InventoryMovement(
        id: 'mov-init-1',
        orderId: 'ORD-101',
        branchId: TalkOsBranches.main,
        orderLineId: 'line-1',
        productId: 'prod_butter_chicken',
        inventoryItemId: 'inv_chicken',
        quantityMicros: 500000,
        recipeVersion: 1,
        channel: OrderChannel.pos,
      ),
    ],
  );
}

KitchenState createDefaultKitchenState(InventoryState inventory) {
  final order1 = InventoryCookingOrder(
    orderId: 'ORD-102',
    branchId: TalkOsBranches.main,
    channel: OrderChannel.pos,
    lines: const [
      InventoryOrderLine(lineId: 'l1', productId: 'prod_butter_chicken', quantity: 1),
      InventoryOrderLine(lineId: 'l2', productId: 'prod_garlic_naan', quantity: 2),
    ],
  );

  final order2 = InventoryCookingOrder(
    orderId: 'ORD-103',
    branchId: TalkOsBranches.main,
    channel: OrderChannel.pos,
    lines: const [
      InventoryOrderLine(lineId: 'l3', productId: 'prod_biryani', quantity: 1),
    ],
  );

  return KitchenState(
    branchId: TalkOsBranches.main,
    tickets: {
      'ORD-102': KitchenTicket(
        id: 'ORD-102',
        branchId: TalkOsBranches.main,
        inventoryOrder: order1,
        tableLabel: 'Table 3',
        productNames: const {
          'prod_butter_chicken': 'Butter Chicken',
          'prod_garlic_naan': 'Garlic Naan',
        },
      ),
      'ORD-103': KitchenTicket(
        id: 'ORD-103',
        branchId: TalkOsBranches.main,
        inventoryOrder: order2,
        tableLabel: 'Table 7',
        productNames: const {
          'prod_biryani': 'Dum Biryani',
        },
      ),
    },
    inventory: inventory,
  );
}
