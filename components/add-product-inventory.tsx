'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';
import { getProducts, getInventory, createInventory } from '@/lib/api-service';

const inventorySchema = z.object({
  productId: z.string().min(1, 'Please select a product'),
  quantityAvailable: z.coerce.number().int().nonnegative({
    message: 'Quantity must be a non-negative integer.',
  }),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;

interface InventoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Product {
  id: number;
  name: string;
}

interface InventoryItem {
  id: number;
  product: Product;
  quantityAvailable: number;
}

export function InventoryDialog({
  open,
  onClose,
  onSuccess,
}: InventoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      productId: '',
      quantityAvailable: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingProducts(true);
        const [allProducts, allInventory] = await Promise.all([
          getProducts(),
          getInventory(),
        ]);

        const inventoryProductIds = new Set(
          allInventory.map((item: InventoryItem) => item.product.id)
        );

        const availableProducts = allProducts.filter(
          (product: Product) => !inventoryProductIds.has(product.id)
        );

        setFilteredProducts(availableProducts);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load products.',
          variant: 'destructive',
        });
      } finally {
        setLoadingProducts(false);
      }
    };

    if (open) {
      fetchData();
      form.reset(); // Clear previous state when opening
    }
  }, [open, form]);

  const onSubmit = async (data: InventoryFormValues) => {
    setIsSubmitting(true);
    try {
      const productId = parseInt(data.productId);

      await createInventory({
        product: { id: productId },
        quantityAvailable: data.quantityAvailable,
      });

      toast({
        title: 'Inventory Created',
        description: 'The product has been added to inventory.',
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create inventory. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add to Inventory</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Product</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loadingProducts}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <SelectItem
                            key={product.id}
                            value={String(product.id)}
                          >
                            {product.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-muted-foreground text-sm">
                          All products are in inventory
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantityAvailable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity Available</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Enter quantity"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Add to Inventory'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
