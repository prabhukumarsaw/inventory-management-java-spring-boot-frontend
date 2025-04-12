export interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface InventoryItem {
    id: number;
    product: Product;
    quantityAvailable: number;
    lastUpdated: string | null;
  }
  
  export interface OrderItem {
    product: { id: number };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }
  
  export interface Order {
    id: number;
    orderType: "SALE" | "PURCHASE";
    status: "PENDING" | "COMPLETED" | "SHIPPED" | "CANCELLED";
    contactName: string;
    orderDate: string;
    notes?: string;
    orderItems: OrderItem[];
  }

  export interface DashboardMetrics {
    totalProducts: number;
    pendingOrders: number;
    lowStockItems: number;
    monthlyRevenue: number;
    monthlyGrowth: number;
  }