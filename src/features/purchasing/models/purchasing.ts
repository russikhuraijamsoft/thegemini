export type SupplierStatus = 'ACTIVE' | 'INACTIVE' | 'BLACKLISTED';
export type POStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'PARTIAL' | 'FULFILLED' | 'CANCELLED';
export type PRStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
export type GRNStatus = 'DRAFT' | 'RECEIVED' | 'PARTIAL' | 'REJECTED';
export type InvoiceStatus = 'PENDING' | 'VERIFIED' | 'PAID' | 'DISPUTED';

export interface Supplier {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  gstNumber?: string;
  rating: number;
  status: SupplierStatus;
  paymentTerms: string;
  creditLimit: number;
  outstandingBalance: number;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branchCode: string;
  };
  address: string;
  createdAt: string;
}

export interface PurchaseRequisition {
  id: string;
  department: string;
  requestorId: string;
  requestorName: string;
  status: PRStatus;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
    estimatedPrice: number;
  }[];
  totalEstimatedValue: number;
  requiredDate: string;
  createdAt: string;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  status: POStatus;
  items: {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    receivedQuantity: number;
    unit: string;
  }[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  expectedDeliveryDate: string;
  createdAt: string;
  createdBy: string;
  approvedBy?: string;
  notes?: string;
}

export interface GRN {
  id: string;
  grnNumber: string;
  poId: string;
  poNumber: string;
  supplierId: string;
  status: GRNStatus;
  receivedDate: string;
  items: {
    poItemId: string;
    productId: string;
    productName: string;
    orderedQuantity: number;
    receivedQuantity: number;
    acceptedQuantity: number;
    rejectedQuantity: number;
    rejectionReason?: string;
  }[];
  receivedBy: string;
  notes?: string;
}

export interface SupplierInvoice {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  poId?: string;
  grnId?: string;
  status: InvoiceStatus;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  dueDate: string;
  createdAt: string;
}
