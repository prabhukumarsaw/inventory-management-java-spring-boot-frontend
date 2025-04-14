import type { Order } from '@/types/types';

interface InvoiceViewProps {
  order: Order;
}

export function InvoiceView({ order }: InvoiceViewProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const calculateSubtotal = () => {
    return order.orderItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <div className="p-4 bg-muted sm:p-6 text-sm sm:text-base">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">INVOICE</h2>
          <p className="text-gray-500 text-sm">#{order.id}</p>
        </div>
        <div className="text-left sm:text-right text-xs sm:text-xs">
          <h3 className="font-bold text-base">Company Name</h3>
          <p>123 Business Street</p>
          <p>Business City, 12345</p>
          <p>contact@company.com</p>
        </div>
      </div>

      {/* Bill To + Order Info */}
      <div className="grid grid-cols-1 justify-between sm:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8 text-xs sm:text-xs">
        <div>
          <h4 className="font-semibold mb-1 text-gray-600">Bill To:</h4>
          <p className="font-bold">{order.contactName}</p>
          <p>Customer Address</p>
          <p>Customer City, 12345</p>
        </div>
        <div className="grid grid-cols-2 gap-y-1">
          <div className="font-semibold text-gray-600">Invoice Date:</div>
          <div>{formatDate(order.orderDate)}</div>

          <div className="font-semibold text-gray-600">Order Type:</div>
          <div>{order.orderType}</div>

          <div className="font-semibold text-gray-600">Status:</div>
          <div>{order.status}</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mb-6 sm:mb-8">
        <table className="w-full border-collapse text-xs sm:text-xs">
          <thead>
            <tr className="">
              <th className="border p-2 text-left">Item</th>
              <th className="border p-2 text-right">Quantity</th>
              <th className="border p-2 text-right">Unit Price</th>
              <th className="border p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">{item.product.name}</td>
                <td className="border p-2 text-right">{item.quantity}</td>
                <td className="border p-2 text-right">
                  ₹{item.unitPrice.toFixed(2)}
                </td>
                <td className="border p-2 text-right">
                  ₹{item.totalPrice.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="border p-2 text-right font-semibold">
                Subtotal:
              </td>
              <td className="border p-2 text-right">
                ₹{calculateSubtotal().toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="border p-2 text-right font-semibold">
                Tax (0%):
              </td>
              <td className="border p-2 text-right">
                ₹{calculateTax().toFixed(2)}
              </td>
            </tr>
            <tr className="">
              <td colSpan={3} className="border p-2 text-right font-bold">
                Total:
              </td>
              <td className="border p-2 text-right font-bold">
                ₹{calculateTotal().toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="mb-6 sm:mb-8 text-xs sm:text-xs">
          <h4 className="font-semibold mb-1 text-gray-600">Notes:</h4>
          <p className="p-3  rounded">{order.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-gray-500 text-xs sm:text-xs mt-10">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
}
