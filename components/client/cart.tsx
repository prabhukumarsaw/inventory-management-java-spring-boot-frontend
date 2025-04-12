'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { Trash2, Plus, Minus } from 'lucide-react';

export function Cart() {
  const {
    items,
    customerName,
    setCustomerName,
    removeItem,
    updateQuantity,
    total,
    clearCart,
  } = useCart();

  const handleSubmit = async () => {
    try {
      const orderData = {
        orderType: 'SALE',
        status: 'PENDING',
        contactName: customerName,
        notes: '',
        orderItems: items.map((item) => ({
          product: { id: item.productId },
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
      };

      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      // Show success message
      alert('Order created successfully!');
      clearCart();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  return (
    <div className="w-96 border-l h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Order Summary</h2>
      </div>

      <div className="p-4 border-b">
        <Input
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Your cart is empty</p>
        ) : (
          items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  ₹{item.price.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity - 1)
                  }
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity + 1)
                  }
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.productId)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Total:</span>
          <span className="font-semibold">₹{total.toFixed(2)}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={clearCart}
            disabled={items.length === 0}
          >
            Clear
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={items.length === 0 || !customerName}
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
