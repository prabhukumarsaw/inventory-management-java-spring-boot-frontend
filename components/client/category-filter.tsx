'use client';
import { useQuery } from '@tanstack/react-query';
import { InventoryItem } from '@/types/types';

async function fetchInventory(): Promise<InventoryItem[]> {
  const response = await fetch('http://localhost:8080/api/inventory');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export function CategoryFilter() {
  const { data } = useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
  });

  // Extract unique categories
  const categories = Array.from(
    new Set(data?.map((item) => item.product.category))
  ).map((category) => ({
    label: category,
    items: `${
      data?.filter((item) => item.product.category === category).length
    } Items`,
  }));

  return (
    <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
      <div className="flex flex-col items-center p-3 rounded-xl min-w-[100px]  text-green-600 border cursor-pointer bg-muted">
        <span className="text-sm font-medium">All</span>
        <span className="text-xs text-gray-500">{data?.length} Items</span>
      </div>

      {categories.map((category, index) => (
        <div
          key={index}
          className="flex flex-col items-center p-3 rounded-xl min-w-[100px]  border cursor-pointer hover:bg-muted"
        >
          <span className="text-sm font-medium">{category.label}</span>
          <span className="text-xs text-gray-500">{category.items}</span>
        </div>
      ))}
    </div>
  );
}
