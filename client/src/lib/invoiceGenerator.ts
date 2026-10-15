import type { Order } from '../app/models/order'
import { currencyFormat, formatAddressString, formatPaymentString } from './util'
import { format } from 'date-fns'

export function generateAndPrintInvoice(order: Order) {
  const invoiceHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice #${order.id} - CrapCart</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            font-family: Arial, Helvetica, sans-serif;
            color: #333;
            margin: 0;
            padding: 20px;
            font-size: 13px;
            line-height: 1.5;
          }
          .invoice-box {
            max-width: 800px;
            margin: auto;
            border: 1px solid #eee;
            padding: 30px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
          }
          .header-table {
            width: 100%;
            margin-bottom: 25px;
            border-bottom: 2px solid #673ab7;
            padding-bottom: 15px;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #673ab7;
          }
          .invoice-title {
            text-align: right;
            font-size: 20px;
            font-weight: bold;
            color: #444;
          }
          .info-table {
            width: 100%;
            margin-bottom: 25px;
          }
          .info-table td {
            vertical-align: top;
            width: 50%;
          }
          .section-title {
            font-weight: bold;
            color: #673ab7;
            text-transform: uppercase;
            font-size: 12px;
            margin-bottom: 5px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
          }
          .items-table th {
            background-color: #f7f7f7;
            color: #444;
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
          }
          .items-table td {
            border: 1px solid #ddd;
            padding: 10px;
          }
          .items-table td.text-right, .items-table th.text-right {
            text-align: right;
          }
          .summary-table {
            width: 50%;
            margin-left: auto;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .summary-table td {
            padding: 6px 10px;
          }
          .summary-table tr.total-row td {
            font-size: 16px;
            font-weight: bold;
            color: #673ab7;
            border-top: 2px solid #673ab7;
            border-bottom: 2px solid #673ab7;
          }
          .footer {
            text-align: center;
            color: #777;
            font-size: 11px;
            border-top: 1px solid #eee;
            padding-top: 15px;
          }
          .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            background: #e8f5e9;
            color: #2e7d32;
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <table class="header-table">
            <tr>
              <td>
                <div class="company-name">CRAPCART</div>
                <div>Premium E-Commerce Platform</div>
                <div>support@crapcart.com | www.crapcart.com</div>
              </td>
              <td class="invoice-title">
                <div>TAX INVOICE</div>
                <div style="font-size: 13px; font-weight: normal; color: #666; margin-top: 5px;">
                  Invoice #: <strong>INV-${order.id.toString().padStart(6, '0')}</strong><br/>
                  Order Date: ${format(new Date(order.orderDate), 'dd MMM yyyy')}<br/>
                  Status: <span class="badge">${order.orderStatus.toUpperCase()}</span>
                </div>
              </td>
            </tr>
          </table>

          <table class="info-table">
            <tr>
              <td>
                <div class="section-title">Billed / Shipped To:</div>
                <strong>${order.shippingAddress.name}</strong><br/>
                ${formatAddressString(order.shippingAddress)}<br/>
                Email: ${order.buyerEmail}
              </td>
              <td style="text-align: right;">
                <div class="section-title">Payment Information:</div>
                Payment Method: ${formatPaymentString(order.paymentSummary)}<br/>
                Payment Status: <strong>PAID IN FULL</strong><br/>
                Delivery Method: Standard Express
              </td>
            </tr>
          </table>

          <table class="items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Description</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.orderItems
                .map(
                  (item, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><strong>${item.name || item.productName || 'Product #' + item.productId}</strong></td>
                  <td class="text-right">${currencyFormat(item.price)}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">${currencyFormat(item.price * item.quantity)}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <table class="summary-table">
            <tr>
              <td>Subtotal:</td>
              <td class="text-right">${currencyFormat(order.subtotal)}</td>
            </tr>
            ${
              order.discount > 0
                ? `<tr>
                    <td style="color: #2e7d32;">Discount (Coupon):</td>
                    <td class="text-right" style="color: #2e7d32;">-${currencyFormat(order.discount)}</td>
                  </tr>`
                : ''
            }
            <tr>
              <td>Delivery Fee:</td>
              <td class="text-right">${order.deliveryFee === 0 ? 'FREE' : currencyFormat(order.deliveryFee)}</td>
            </tr>
            <tr class="total-row">
              <td>Total Amount Paid:</td>
              <td class="text-right">${currencyFormat(order.total)}</td>
            </tr>
          </table>

          <div class="footer">
            <p>Thank you for purchasing with CrapCart!</p>
            <p>This is a computer-generated digital invoice and does not require a physical signature.</p>
          </div>
        </div>
      </body>
    </html>
  `

  const printWindow = window.open('', '_blank', 'width=900,height=700')
  if (printWindow) {
    printWindow.document.write(invoiceHtml)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }
}
