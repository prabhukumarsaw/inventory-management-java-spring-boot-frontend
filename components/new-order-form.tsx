'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { createOrder } from '@/lib/api-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

const orderSchema = z.object({
  orderType: z.enum(['SALE', 'PURCHASE']),
  contactName: z.string().min(2, {
    message: 'Contact name must be at least 2 characters.',
  }),
  notes: z.string().optional(),
  orderItems: z
    .array(
      z.object({
        productId: z.number(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().positive(),
      })
    )
    .min(1, {
      message: 'Order must have at least one item.',
    }),
});

type OrderFormValues = z.infer<typeof orderSchema>;

// Mock products for demonstration
const mockProducts = [
  { id: 3, name: 'Mechanical Keyboard', price: 89.99 },
  { id: 4, name: 'Office Chair', price: 199.99 },
  { id: 5, name: 'Desk Lamp', price: 39.99 },
  { id: 13, name: 'Gaming Mouse', price: 25.5 },
  { id: 14, name: 'Wireless Headphones', price: 149.99 },
];

export function NewOrderForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: Partial<OrderFormValues> = {
    orderType: 'SALE',
    contactName: '',
    notes: '',
    orderItems: [{ productId: 0, quantity: 1, unitPrice: 0 }],
  };

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'orderItems',
  });

  const watchOrderItems = form.watch('orderItems');

  const calculateTotal = () => {
    return watchOrderItems.reduce((total, item) => {
      return total + item.quantity * item.unitPrice;
    }, 0);
  };

  const handleProductChange = (index: number, productId: number) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      form.setValue(`orderItems.${index}.unitPrice`, product.price);
    }
  };

  async function onSubmit(data: OrderFormValues) {
    setIsSubmitting(true);
    try {
      // Transform the data to match the API format
      const orderData = {
        ...data,
        status: 'PENDING',
        orderDate: new Date().toISOString(),
        orderItems: data.orderItems.map((item) => ({
          product: { id: item.productId },
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
        })),
      };

      await createOrder(orderData);
      toast({
        title: 'Order created',
        description: 'The order has been created successfully.',
      });

      router.push('/orders');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="orderType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SALE">Sale</SelectItem>
                    <SelectItem value="PURCHASE">Purchase</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Type of order being created.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter customer or supplier name"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Name of the customer or supplier.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional notes"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Any special instructions or notes for this order.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-4 items-end"
                >
                  <div className="col-span-5">
                    <FormField
                      control={form.control}
                      name={`orderItems.${index}.productId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(Number.parseInt(value));
                              handleProductChange(
                                index,
                                Number.parseInt(value)
                              );
                            }}
                            value={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockProducts.map((product) => (
                                <SelectItem
                                  key={product.id}
                                  value={product.id.toString()}
                                >
                                  {product.name} - ${product.price.toFixed(2)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`orderItems.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number.parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name={`orderItems.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value)
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() =>
                  append({ productId: 0, quantity: 1, unitPrice: 0 })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>

              <div className="flex justify-between pt-4 border-t mt-6">
                <div className="text-lg font-semibold">Total:</div>
                <div className="text-lg font-semibold">
                  ${calculateTotal().toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Order'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
