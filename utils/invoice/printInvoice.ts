// src/utils/invoice/printInvoice.ts

export const printInvoice = (orderId: number | string) => {
    const invoiceContent = document.getElementById('invoice-content');
    if (!invoiceContent) return;
  
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
  
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Invoice #${orderId}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <style>
          body {
            font-family: 'Inter', sans-serif;
            background: white;
            color: black;
            padding: 1cm;
            font-size: 12px;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #e5e7eb;
            padding: 8px;
          }
          th {
            background: #f3f4f6;
          }
          .no-print { display: none; }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          ${invoiceContent.innerHTML}
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.close();
          }
        </script>
      </body>
      </html>
    `);
  
    printWindow.document.close();
  };
  