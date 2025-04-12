'use client';
import { ItemCard } from './item-card';
import { useQuery } from '@tanstack/react-query';
import type { InventoryItem } from '@/types/types';

async function fetchInventory(): Promise<InventoryItem[]> {
  const response = await fetch('http://localhost:8080/api/inventory');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export function ItemGrid() {
  const { data, isLoading, error } = useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
  });

  if (isLoading)
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading inventory...
      </div>
    );
  if (error)
    return (
      <div className="p-4 text-center text-destructive">
        Error: {error.message}
      </div>
    );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {data?.map((item) => (
        <ItemCard
          key={item.id}
          id={item.product.id}
          name={item.product.name}
          description={item.product.description}
          price={item.product.price}
          category={item.product.category}
          quantityAvailable={item.quantityAvailable}
        />
      ))}
    </div>
  );
}
