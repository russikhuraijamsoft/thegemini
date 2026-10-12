export type CustomerTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';
export type PromoType = 'PERCENTAGE' | 'FIXED' | 'BOGO' | 'FREE_ITEM';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob?: string;
  anniversary?: string;
  loyaltyPoints: number;
  tier: CustomerTier;
  status: CustomerStatus;
  totalVisits: number;
  totalSpent: number;
  lastVisit?: string;
  preferences: string[];
  dietary: string[];
  allergies: string[];
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export interface Promotion {
  id: string;
  code: string;
  name: string;
  description: string;
  type: PromoType;
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  timesUsed: number;
  targetSegments: string[];
}

export interface Feedback {
  id: string;
  customerId: string;
  customerName: string;
  orderId?: string;
  rating: number; // 1-5
  comment: string;
  status: 'PENDING' | 'RESOLVED';
  resolution?: string;
  createdAt: string;
}
