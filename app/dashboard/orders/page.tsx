import { Button } from '@/components/ui/button';
import { Plus, ShoppingCart } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { OrdersTable } from '@/components/orders-table';
import Link from 'next/link';

export default function OrdersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Orders" description="Manage customer orders">
        {/* <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/orders/cart">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Order
            </Link>
          </Button>
        </div> */}
      </DashboardHeader>

      <main className="flex-1 p-4 md:p-6 pt-16 lg:pt-6">
        <OrdersTable />
      </main>
    </div>
  );
}
