

export const downloadInvoice = (orderId: number | string) => {
    const invoiceContent = document.getElementById('invoice-content');
    if (!invoiceContent) return;
  
    const html = `
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
              background-color: white;
              color: black;
              margin: 1cm;
              font-size: 12px;
            }
  
            table {
              border-collapse: collapse;
              width: 100%;
            }
  
            th, td {
              border: 1px solid #e5e7eb;
              padding: 8px;
              text-align: left;
            }
  
            th {
              background-color: #f3f4f6;
              font-weight: 600;
            }
  
            .total-row {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            ${invoiceContent.innerHTML}
          </div>
        </body>
      </html>
    `;
  
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${orderId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  