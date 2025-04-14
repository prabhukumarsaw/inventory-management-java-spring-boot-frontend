'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { Check, Plus } from 'lucide-react';
import { useState } from 'react';

type ItemCardProps = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  quantityAvailable: number;
};

export function ItemCard({
  id,
  name,
  description,
  price,
  category,
  quantityAvailable,
}: ItemCardProps) {
  const { items, addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (quantityAvailable <= 0) return; // Do not allow adding to cart if no stock

    // Check if the product is already in the cart
    const existingItem = items.find((item) => item.productId === id);

    if (existingItem) {
      // Check if adding another item would exceed available stock
      const newQuantity = existingItem.quantity + 1;
      if (newQuantity > quantityAvailable) {
        alert('You cannot add more than the available quantity!');
        return;
      }
    }

    // Add item to the cart
    addItem(id, name, price);
    setIsAdded(true);

    // Reset "Added" state after 1.5 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <Card
      className={`h-full flex flex-col overflow-hidden transition-all duration-200 cursor-pointer ${
        isAdded ? 'ring-1 ring-border' : 'hover:bg-accent'
      } ${quantityAvailable <= 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
      onClick={handleAddToCart}
    >
      {/* Circular image container at top center */}
      <div className="relative flex items-center justify-center pt-6">
        <div className="relative w-24 h-24 rounded-full bg-accent flex items-center justify-center overflow-hidden">
          <img
            src={`https://picsum.photos/seed/${id}/100/100`}
            alt={name}
            className="w-full h-full object-cover"
          />

          {isAdded && (
            <div className="absolute inset-0 bg-accent flex items-center justify-center">
              <Check className="text-accent-foreground w-8 h-8" />
            </div>
          )}
        </div>

        {/* Status badges */}
        {quantityAvailable <= 0 && (
          <Badge variant="outline" className="absolute top-2 right-2">
            Out of stock
          </Badge>
        )}
        {quantityAvailable > 0 && quantityAvailable < 5 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Low: {quantityAvailable}
          </Badge>
        )}

        {/* Category badge */}
        <Badge variant="secondary" className="absolute top-2 left-2 text-xs">
          {category}
        </Badge>
      </div>

      {/* Content */}
      <CardContent className="flex-grow p-4 pt-3 flex flex-col items-center text-center">
        <div className="space-y-1.5 w-full">
          <h3 className="font-medium text-sm line-clamp-1">{name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <p className="text-base font-medium">₹{price.toFixed(2)}</p>
            {quantityAvailable > 0 && !isAdded && (
              <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                <Plus className="h-3 w-3 text-accent-foreground" />
              </div>
            )}
            {isAdded && (
              <span className="text-xs text-muted-foreground">Added</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
