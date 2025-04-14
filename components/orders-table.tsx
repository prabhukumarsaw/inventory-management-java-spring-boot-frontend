'use client';

import { useState, useEffect } from 'react';
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
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
  Eye,
  FileText,
  ArrowUpDown,
  CheckCircle,
  Truck,
  XCircle,
  Download,
  Printer,
  X,
} from 'lucide-react';
import { getOrders, getOrder, updateOrderStatus } from '@/lib/api-service';
import type { Order } from '@/types/types';
import { InvoiceView } from './invoice-view';
import { printInvoice } from '@/utils/invoice/printInvoice';
import { downloadInvoice } from '@/utils/invoice/downloadInvoice';

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    try {
      const orderData = await getOrder(orderId);
      setSelectedOrder(orderData);
      return orderData;
    } catch (err) {
      console.error('Failed to fetch order details:', err);
      return null;
    }
  };

  const handleViewInvoice = async (orderId: number) => {
    const orderData = await fetchOrderDetails(orderId);
    if (orderData) {
      setInvoiceDialogOpen(true);
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Refresh orders after status update
      fetchOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Calculate total amount for each order
  const calculateOrderTotal = (order: Order): number => {
    return order.orderItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const filteredOrders = orders
    .filter(
      (order) =>
        order.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
    )
    .filter((order) => statusFilter === 'all' || order.status === statusFilter)
    .filter((order) => typeFilter === 'all' || order.orderType === typeFilter)
    .sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc'
          ? new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
          : new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
      } else if (sortField === 'amount') {
        return sortDirection === 'asc'
          ? calculateOrderTotal(a) - calculateOrderTotal(b)
          : calculateOrderTotal(b) - calculateOrderTotal(a);
      } else if (sortField === 'id') {
        return sortDirection === 'asc' ? a.id - b.id : b.id - a.id;
      }

      return 0;
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'PENDING':
        return <div className="h-4 w-4 rounded-full bg-yellow-500" />;
      case 'SHIPPED':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading orders...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center p-8 text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative w-full">
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="SALE">Sales</SelectItem>
              <SelectItem value="PURCHASE">Purchases</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  Order ID
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.orderType === 'SALE' ? 'default' : 'outline'
                      }
                    >
                      {order.orderType}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.contactName}</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    ₹{calculateOrderTotal(order).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleViewInvoice(order.id)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className=" text-sm">View Invoice</span>
                    </Button>
                    {/* <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => handleViewInvoice(order.id)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View invoice
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Select
                            onValueChange={(value) =>
                              handleUpdateStatus(order.id, value)
                            }
                          >
                            <SelectTrigger className="border-none p-0 h-auto shadow-none">
                              <span>Update status</span>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PENDING">Pending</SelectItem>
                              <SelectItem value="SHIPPED">Shipped</SelectItem>
                              <SelectItem value="COMPLETED">
                                Completed
                              </SelectItem>
                              <SelectItem value="CANCELLED">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
        {/* Proper clickable trigger (can be styled however you want) */}
        <DialogTrigger asChild>
          <Button variant="outline">View Invoice #{selectedOrder?.id}</Button>
        </DialogTrigger>

        <DialogContent className="max-w-xl w-full h-[95vh] rounded-2xl p-0 sm:p-0 flex flex-col">
          {/* Sticky Header INSIDE Dialog */}
          <div className="sticky top-0 z-10 px-6 py-4 border-b flex justify-between items-center bg-background">
            <DialogTitle asChild>
              <VisuallyHidden>Invoice #{selectedOrder?.id}</VisuallyHidden>
            </DialogTitle>

            <span className="text-lg font-semibold">
              Invoice #{selectedOrder?.id}
            </span>

            <div className="flex gap-2 items-center">
              {selectedOrder && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => printInvoice(selectedOrder?.id)}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadInvoice(selectedOrder?.id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </>
              )}
              <DialogClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                </Button>
              </DialogClose>
            </div>
          </div>

          {/* Scrollable Invoice Content */}
          <div
            id="invoice-content"
            className="overflow-y-auto p-6 scrollbar-thin flex-1"
          >
            {selectedOrder && <InvoiceView order={selectedOrder} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
