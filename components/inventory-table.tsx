// src/components/inventory-table.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MoreHorizontal,
  Search,
  Edit,
  AlertTriangle,
  ArrowUpDown,
  Plus,
  Minus,
  Delete,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';
import {
  getInventory,
  updateStock,
  InventoryItem,
  deleteInventory,
} from '@/lib/api-service';

export function InventoryTable() {
  const queryClient = useQueryClient();
  const {
    data: inventoryItems,
    isLoading,
    error,
  } = useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: getInventory,
  });

  const mutation = useMutation({
    mutationFn: ({
      productId,
      quantityChange,
    }: {
      productId: number;
      quantityChange: number;
    }) => updateStock(productId, quantityChange),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: 'Stock updated',
        description: 'Inventory levels have been updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error updating stock',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this product?'
    );
    if (!confirmDelete) return;

    try {
      await deleteInventory(id);
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete product. Please try again.');
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < 10) return 'low-stock';
    if (quantity > 40) return 'over-stock';
    return 'optimal';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Skeleton className="h-10 w-full max-w-sm" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(7)].map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-6 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(7)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500">Error loading inventory</p>
          <p className="text-muted-foreground">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  if (!inventoryItems || inventoryItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No inventory items available</p>
      </div>
    );
  }

  const filteredInventory = inventoryItems
    .filter(
      (item) =>
        item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .filter(
      (item) =>
        categoryFilter === 'all' || item.product.category === categoryFilter
    )
    .filter((item) => {
      if (stockFilter === 'all') return true;
      return getStockStatus(item.quantityAvailable) === stockFilter;
    })
    .sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc'
          ? a.product.name.localeCompare(b.product.name)
          : b.product.name.localeCompare(a.product.name);
      } else if (sortField === 'category') {
        return sortDirection === 'asc'
          ? a.product.category.localeCompare(b.product.category)
          : b.product.category.localeCompare(a.product.category);
      } else if (sortField === 'quantity') {
        return sortDirection === 'asc'
          ? a.quantityAvailable - b.quantityAvailable
          : b.quantityAvailable - a.quantityAvailable;
      } else if (sortField === 'price') {
        return sortDirection === 'asc'
          ? a.product.price - b.product.price
          : b.product.price - a.product.price;
      }
      return 0;
    });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const categories = Array.from(
    new Set(inventoryItems.map((item) => item.product.category))
  );

  const getStockBadge = (quantity: number) => {
    const status = getStockStatus(quantity);

    switch (status) {
      case 'out-of-stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      case 'low-stock':
        return (
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
            <Badge
              variant="outline"
              className="text-yellow-500 border-yellow-500"
            >
              Low Stock
            </Badge>
          </div>
        );
      case 'over-stock':
        return (
          <Badge variant="outline" className="text-blue-500 border-blue-500">
            Overstock
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-green-500 border-green-500">
            Optimal
          </Badge>
        );
    }
  };

  const handleStockChange = (productId: number, change: number) => {
    mutation.mutate({ productId, quantityChange: change });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock Levels</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="optimal">Optimal</SelectItem>
              <SelectItem value="over-stock">Overstock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Product
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  Category
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('quantity')}
                >
                  Quantity
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">
                Last Updated
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No inventory items found
                </TableCell>
              </TableRow>
            ) : (
              filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-sm text-muted-foreground hidden md:block">
                        ₹{item.product.price.toFixed(2)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => handleStockChange(item.product.id, -1)}
                        disabled={mutation.isPending}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 min-w-[40px] text-center">
                        {item.quantityAvailable}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => handleStockChange(item.product.id, 1)}
                        disabled={mutation.isPending}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{getStockBadge(item.quantityAvailable)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(item.lastUpdated)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Update Stock
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                          <Delete className="mr-2 h-4 w-4" /> Delete Inventory
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
