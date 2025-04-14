'use client';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/dashboard-header';
import { InventoryTable } from '@/components/inventory-table';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { InventoryDialog } from '@/components/add-product-inventory';

export default function InventoryPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Inventory" description="Manage your stock levels">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Update Inventory
        </Button>
      </DashboardHeader>

      <main className="flex-1 p-4 md:p-6 pt-16 lg:pt-6">
        <InventoryTable />
      </main>

      <InventoryDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
