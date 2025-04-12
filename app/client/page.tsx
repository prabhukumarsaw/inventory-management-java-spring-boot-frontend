'use client';

import { Header } from '@/components/client/header';
import { CategoryFilter } from '@/components/client/category-filter';
import { ItemGrid } from '@/components/client/item-grid';
import { Cart } from '@/components/client/cart';
import { CartProvider } from '@/hooks/use-cart';
import { DashboardHeader } from '@/components/dashboard-header';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function POSPage() {
  return (
    <CartProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* <Header /> */}
        <DashboardHeader
          title="Dashboard"
          description="Overview of your inventory system"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search Product here..."
              className="pl-10 w-full"
            />
          </div>
        </DashboardHeader>
        <div className="flex flex-1 overflow-hidden">
          {' '}
          {/* Main content */}
          {/* Left - Filters + Product */}
          <main className="flex flex-1 flex-col overflow-hidden p-4">
            <CategoryFilter />
            <div className="flex-1 overflow-y-auto mt-4 rounded ">
              <ItemGrid />
            </div>
          </main>
          {/* Right - Cart */}
          <Cart />
        </div>
      </div>
    </CartProvider>
  );
}
