'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  DollarSign,
  IndianRupee,
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { InventoryStatusChart } from '@/components/inventory-status-chart';
import { SalesChart } from '@/components/sales-chart';
import { useQuery } from '@tanstack/react-query';
import {
  getProducts,
  getOrders,
  getInventory,
  type Product,
  type InventoryItem,
  type Order,
} from '@/lib/api-service';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

interface DashboardMetrics {
  totalProducts: number;
  totalOrders: number;
  lowStockItems: number;
  monthlyRevenue: number;
  monthlyGrowth: number;
}

export default function DashboardPage() {
  // Fetch data with proper typing
  const { data: products = [], isLoading: productsLoading } = useQuery<
    Product[]
  >({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: getOrders,
  });

  const { data: inventory = [], isLoading: inventoryLoading } = useQuery<
    InventoryItem[]
  >({
    queryKey: ['inventory'],
    queryFn: getInventory,
  });

  // Calculate dashboard metrics with proper typing
  const metrics = useMemo<DashboardMetrics>(() => {
    const totalProducts = products.length;

    const totalOrders = orders.filter(
      (order) => order.status === 'COMPLETED'
    ).length;

    const lowStockItems = inventory.filter(
      (item) => item.quantityAvailable < 10
    ).length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyRevenue = orders
      .filter((order) => {
        const orderDate = new Date(order.orderDate);
        return (
          order.status === 'COMPLETED' &&
          orderDate.getMonth() === currentMonth &&
          orderDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, order) => {
        const orderTotal = order.orderItems.reduce(
          (orderSum, item) => orderSum + item.totalPrice,
          0
        );
        return sum + orderTotal;
      }, 0);

    // Simplified growth calculation (replace with your actual business logic)
    const monthlyGrowth = 18.2; // This should be calculated from previous month data

    return {
      totalProducts,
      totalOrders,
      lowStockItems,
      monthlyRevenue,
      monthlyGrowth,
    };
  }, [products, orders, inventory]);

  // Loading state
  if (productsLoading || ordersLoading || inventoryLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader
          title="Dashboard"
          description="Overview of your inventory system"
        />
        <main className="flex-1 p-4 md:p-6 pt-16 lg:pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-[80px] mb-2" />
                  <Skeleton className="h-3 w-[120px]" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Skeleton className="lg:col-span-4 h-[350px]" />
            <Skeleton className="lg:col-span-3 h-[350px]" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Dashboard"
        description="Overview of your inventory system"
      />

      <main className="flex-1 p-4 md:p-6 pt-16 lg:pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                +12 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalOrders}</div>
              <p className="text-xs text-muted-foreground">-3 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Low Stock Items
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.lowStockItems}</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Revenue
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹
                {metrics.monthlyRevenue.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                +{metrics.monthlyGrowth}% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <SalesChart orders={orders} />
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Inventory Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <InventoryStatusChart inventory={inventory} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Detailed analytics will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Generated reports will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
