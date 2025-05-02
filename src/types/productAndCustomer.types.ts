export interface Product {
  name: string;
  size: string;
  color: string;
  availableStock: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface PaymentMethod {
  _id: string;
  accountName: string;
  accountType: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

ecport interface Employee {
  _id: string;
  firstName: string;
  email: string;
  address: string | null;
  phone: string;
  role: string;
  avatar: string;
  branch: number;
  branchInfo: {
    id: number;
    branchName: string;
    branchLocation: string;
    due: number;
    address: string;
    phone: string;
    hotline: string;
    email: string;
    openHours: null;
    closingHours: null;
    isAdjustment: boolean;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}