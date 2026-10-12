export type ItemSize = 'Small' | 'Medium' | 'Large' | 'Standard';

export interface MenuItemSize {
  id?: string;
  item_id: string;
  size: ItemSize;
  price: number;
  cost_price?: number;
  active: boolean;
}

export interface ComboComponentChoice {
  itemId: string;
  name: string;
  size?: ItemSize;
}

export interface ComboComponent {
  itemId: string;
  name: string;
  size?: ItemSize;
  quantity: number;
  isChoice?: boolean;
  options?: ComboComponentChoice[];
}

export interface Product {
  id: string;
  name: string;
  price: number; // Base or starting price
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  active?: boolean;
  recipeId?: string; // Link to recipe for cost calculator
  unitCost?: number; // Calculated cost from the cost calculator
  costPrice?: number;
  sizes: MenuItemSize[];
  isCombo?: boolean;
  comboDescription?: string;
  comboComponents?: ComboComponent[];
  isSubItem?: boolean;
}

export interface OrderItem {
  id?: string;
  cartItemId?: string;
  productId: string;
  name: string;
  size?: ItemSize;
  selectedOption?: string; // e.g. "Medium Chicken Chowmein" for combo choice
  price: number;
  quantity: number;
  notes?: string;
  unitCost?: number; // Snapshot of cost at time of sale
  recipeId?: string;
  isCombo?: boolean;
  comboComponents?: ComboComponent[];
}

export type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';

export type PaymentMethod = 'CASH' | 'UPI' | 'CARD' | 'SPLIT';

export type DiscountType = 'PERCENTAGE' | 'FIXED';

export interface PaymentDetails {
  method: PaymentMethod;
  cashTendered?: number;
  changeDue?: number;
  upiReference?: string;
  cardLast4?: string;
  cardType?: string;
  splitBreakdown?: {
    cash: number;
    upi?: number;
    card?: number;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  orderType?: OrderType;
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount?: number;
  discountType?: DiscountType;
  discountValue?: number;
  discountReason?: string;
  tax: number;
  cgst?: number;
  sgst?: number;
  total: number;
  paymentMethod?: PaymentMethod;
  paymentDetails?: PaymentDetails;
  orderNotes?: string;
  cashierName?: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
  voidReason?: string;
  createdAt: string;
  totalCost?: number; // Calculated total cost of the order for profit analysis
}

export interface ParkedOrder {
  id: string;
  label: string;
  orderType: OrderType;
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  orderNotes?: string;
  parkedAt: string;
}
