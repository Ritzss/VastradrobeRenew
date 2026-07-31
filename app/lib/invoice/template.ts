/* eslint-disable @typescript-eslint/no-explicit-any */
import { COMPANY } from "./company";
import { Order } from "@/Types/Order";
import { ITransaction } from "@/model/Transaction";

export function invoiceTemplate(
  order: Order,
  transaction: ITransaction | null,
) {
  const isCOD = order.paymentMethod === "COD";

  // Dynamic values for payment details block
  const transactionNumber = isCOD
    ? "COD Order (N/A)"
    : (transaction?.transactionNumber ?? "Online Prepaid");
  const paymentProvider = isCOD
    ? "Cash Collection on Delivery"
    : (transaction?.provider ?? "Razorpay Secure Gateway");
  const paymentId = isCOD
    ? "N/A (Collect on Delivery)"
    : (transaction?.razorpayPaymentId ?? "Razorpay Online Paid");
  const paymentMethodName = isCOD
    ? "Cash on Delivery (COD)"
    : (transaction?.paymentMethod?.toUpperCase() ??
      order.paymentMethod?.toUpperCase() ??
      "ONLINE PAYMENT");
  const paymentStatusText =
    order.paymentStatus === "Paid"
      ? "PAID"
      : isCOD
        ? "PENDING (COLLECT ON DELIVERY)"
        : "PENDING";
  const paymentStatusClass =
    order.paymentStatus === "Paid" ? "status-paid" : "status-pending";

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link
      rel="icon"
      type="image/png"
      href="https://res.cloudinary.com/dwhn5ec09/image/upload/v1780384052/favicon_obm4xc.ico"
    />
<title>Invoice ${order.invoiceNumber} | VastraDrobe</title>
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Segoe UI", Arial, sans-serif;
}

@page {
    size: A4;
    margin: 15mm;
}

body {
    background: #fcfbfa;
    color: #1a1a1a;
    font-size: 11px;
    line-height: 1.5;
    padding: 10px;
}

.invoice-container {
    width: 100%;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e5e0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

/* ================= HEADER ================= */
.header {
    background: #fff;
    color: #111;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 32px;
    border-bottom: 4px solid #6A0F1F;
}

.brand h1 {
    font-size: 28px;
    letter-spacing: 1px;
    margin-bottom: 4px;
}

.brand p {
    font-size: 11px;
    color: #6a0f1f;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.invoice-meta {
    text-align: right;
}

.invoice-meta h2 {
    font-size: 20px;
    font-weight: 300;
    letter-spacing: 2px;
    color: #1a1a1a;
    margin-bottom: 6px;
    text-transform: uppercase;
}

.invoice-meta p {
    margin: 3px 0;
    color: #4a4a4a;
}

.badge {
    display: inline-block;
    background: #6A0F1F;
    color: #fff;
    padding: 5px 14px;
    border-radius: 4px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 8px;
}

/* ================= COMMON ================= */
.section {
    padding: 20px 32px;
}

.cards {
    display: flex;
    gap: 20px;
}

.card {
    flex: 1;
    background: #fafaf9;
    border: 1px solid #e5e5e0;
    border-left: 4px solid #6A0F1F;
    border-radius: 6px;
    padding: 16px;
}

.card-title {
    font-size: 10px;
    text-transform: uppercase;
    font-weight: 700;
    color: #6A0F1F;
    margin-bottom: 8px;
    letter-spacing: 1.5px;
}

.card strong {
    font-size: 13px;
    color: #1a1a1a;
}

.card p {
    color: #5a5a5a;
    line-height: 1.6;
    margin-top: 4px;
}

/* ================= TABLE ================= */
table {
    width: 100%;
    border-collapse: collapse;
}

thead {
    background: #6A0F1F;
    color: #fff;
}

th {
    padding: 12px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    text-align: left;
}

td {
    padding: 12px;
    border-bottom: 1px solid #e5e5e0;
    vertical-align: top;
    color: #3a3a3a;
}

tbody tr:nth-child(even) {
    background: #fafaf9;
}

.product-name {
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 2px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.variant {
    color: #666;
    font-size: 10px;
}

/* ================= TOTAL ================= */
.total-wrapper {
    display: flex;
    justify-content: flex-end;
    padding: 10px 32px 24px;
}

.total-card {
    width: 320px;
    border: 1px solid #e5e5e0;
    border-radius: 6px;
    overflow: hidden;
}

.total-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 16px;
    border-bottom: 1px solid #e5e5e0;
    font-size: 11px;
    color: #4a4a4a;
}

.total-row:last-child {
    border-bottom: none;
}

.total-row:nth-child(even) {
    background: #fafaf9;
}

.grand-total {
    background: #111;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
}

/* ================= PAYMENT ================= */
.payment {
    display: flex;
    gap: 20px;
    padding: 0 32px 24px;
    page-break-inside: avoid;
    break-inside: avoid;
}

.payment-card {
    flex: 1;
    border: 1px solid #e5e5e0;
    border-radius: 6px;
    padding: 16px;
    background: #fafaf9;
    page-break-inside: avoid;
    break-inside: avoid;
}

.status-paid {
    display: inline-block;
    background: #10b981;
    color: #fff;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 9px;
    font-weight: bold;
    letter-spacing: 1px;
}

.status-pending {
    display: inline-block;
    background: #f59e0b;
    color: #fff;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 9px;
    font-weight: bold;
    letter-spacing: 1px;
}

/* ================= FOOTER ================= */
.footer {
    background: #111;
    color: #fff;
    text-align: center;
    padding: 24px 32px;
    font-size: 10px;
    line-height: 1.7;
    letter-spacing: 0.5px;
}

.footer strong {
    color: #fff;
    text-transform: uppercase;
}

.footer a {
    color: #fff;
    text-decoration: none;
}

/* ================= PRINT ================= */
thead {
    display: table-header-group;
}

tr {
    page-break-inside: avoid;
}

img {
    max-width: 100%;
}

.logo {
    height: 55px;
    width: auto;
}

.page-break {
    page-break-before: always;
    break-before: page;
}
</style>
</head>
<body>

<div class="invoice-container">

    <div class="header">
        <div class="brand">
            <img src="${COMPANY.logo}" style="height:55px;object-fit:contain;margin-bottom:6px;" />
            <p>${COMPANY.tagline}</p>
        </div>

        <div class="invoice-meta">
            <div class="badge">
                ${order.paymentStatus === "Paid" ? "PAID" : "PENDING"}
            </div>
            <h2>TAX INVOICE</h2>
            <p><strong>Invoice :</strong> ${order.invoiceNumber}</p>
            <p><strong>Order :</strong> ${order.orderNumber}</p>
            <p>${new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
    </div>

    <div class="section">
        <div class="cards">
            <div class="card">
                <div class="card-title">Sold By</div>
                <strong>${COMPANY.name}</strong>
                <p>
                    ${COMPANY.address.join("<br>")}
                    <br><br>
                    ✉️ ${COMPANY.email}
                    <br>
                    GSTIN : ${COMPANY.gst}
                </p>
            </div>

            <div class="card">
                <div class="card-title">Bill To</div>
                <strong>${order.deliveryAddress.name ?? "Customer"}</strong>
                <p>
                    ${order.deliveryAddress.address}
                    <br>
                    ${order.deliveryAddress.city ?? ""} ${order.deliveryAddress.state ?? ""} ${order.deliveryAddress.pincode ?? ""}
                    <br><br>
                    📞 Phone: ${order.deliveryAddress.phone}
                    <br>
                    ✉️ Email: ${order.deliveryAddress.email ?? ""}
                </p>
            </div>
        </div>
    </div>

    <div class="section">
        <table>
            <thead>
                <tr>
                    <th style="width:50%">Product Description</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
            ${order.items
              .map(
                (item) => `
                <tr>
                    <td>
                        <div class="product-name">${item.name}</div>
                        <div class="variant">
                            ${item.color ?? "-"} &nbsp;|&nbsp; Size ${item.size}
                            ${item.sku ? `&nbsp;|&nbsp; SKU : ${item.sku}` : ""}
                        </div>
                    </td>
                    <td>${item.quantity}</td>
                    <td>₹${item.price}</td>
                    <td>₹${item.total}</td>
                </tr>
            `,
              )
              .join("")}
            </tbody>
        </table>
    </div>

    <div class="total-wrapper">
        <div class="total-card">
            <div class="total-row">
                <span>Subtotal</span>
                <strong>₹${order.subtotal}</strong>
            </div>
            <div class="total-row">
                <span>Shipping</span>
                <strong>
                    ${order.shippingCharge === 0 ? "FREE" : `₹${order.shippingCharge}`}
                </strong>
            </div>
            <div class="total-row">
                <span>Discount</span>
                <strong>₹${order.discount}</strong>
            </div>
            <div class="total-row">
                <span>GST</span>
                <strong>₹${order.tax}</strong>
            </div>
            <div class="total-row grand-total">
                <span>Grand Total</span>
                <span>₹${order.totalAmount}</span>
            </div>
        </div>
    </div>

    <div class="page-break"></div>

    <div class="payment">
        <div class="payment-card">
            <div class="card-title">Payment Information Details</div>
            <table style="width:100%;border-collapse:collapse;font-size:11px">
                <tr>
                    <td style="width:35%;border:none;padding:8px 0;"><strong>Transaction ID</strong></td>
                    <td style="border:none;padding:8px 0;color:#222;">${transactionNumber}</td>
                </tr>
                <tr>
                    <td style="border:none;padding:8px 0;"><strong>Payment Gateway</strong></td>
                    <td style="border:none;padding:8px 0;color:#222;">${paymentProvider}</td>
                </tr>
                <tr>
                    <td style="border:none;padding:8px 0;"><strong>Payment ID</strong></td>
                    <td style="border:none;padding:8px 0;color:#222;">${paymentId}</td>
                </tr>
                <tr>
                    <td style="border:none;padding:8px 0;"><strong>Payment Method</strong></td>
                    <td style="border:none;padding:8px 0;color:#1a1a1a;font-weight:600;">${paymentMethodName}</td>
                </tr>
                <tr>
                    <td style="border:none;padding:8px 0;"><strong>Payment Status</strong></td>
                    <td style="border:none;padding:8px 0;">
                        <span class="${paymentStatusClass}">
                            ${paymentStatusText}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="border:none;padding:8px 0;"><strong>Currency</strong></td>
                    <td style="border:none;padding:8px 0;color:#222;">${transaction?.currency ?? "INR"}</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="footer">
        <strong>Thank you for shopping with VastraDrobe ❤️</strong>
        <br><br>
        This is a computer generated invoice and does not require a signature.
        <br>
        For inquiries or client concierge support, contact <strong>${COMPANY.email}</strong> or visit <strong>${COMPANY.website}</strong>
    </div>

</div>

</body>
</html>
`;
}
