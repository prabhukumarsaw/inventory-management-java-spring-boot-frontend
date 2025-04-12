'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { ProductsTable } from '@/components/products-table';
import { ProductAddDialog } from '@/components/ProductAddDialog';

export default function ProductsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Products"
        description="Manage your product catalog"
      >
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DashboardHeader>

      <main className="flex-1 p-4 md:p-6 pt-16 lg:pt-6">
        <ProductsTable />
      </main>

      <ProductAddDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => {
          setRefreshKey((prev) => prev + 1); // 🔄 Refetch
        }}
      />
    </div>
  );
}
