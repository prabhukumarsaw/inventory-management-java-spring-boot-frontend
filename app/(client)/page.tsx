'use client';

import { Header } from '@/components/client/header';
import { CategoryFilter } from '@/components/client/category-filter';
import { ItemGrid } from '@/components/client/item-grid';
import { Cart } from '@/components/client/cart';
import { CartProvider } from '@/hooks/use-cart';

export default function POSPage() {
  return (
    <CartProvider>
      <div className="fixed inset-0 flex flex-col bg-background">
        {/* Fixed Header */}
        <div className="shrink-0">
          <Header />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Filter + Items */}
          <main className="flex flex-1 flex-col overflow-hidden p-4">
            <CategoryFilter />
            <div className="flex-1 overflow-y-auto mt-4 rounded">
              <ItemGrid />
            </div>
          </main>

          {/* Right: Cart */}
          <Cart />
        </div>
      </div>
    </CartProvider>
  );
}
