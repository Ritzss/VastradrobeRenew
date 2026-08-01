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

<!-- 👑 LOAD LUXURY GOOGLE FONTS -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Montserrat:wght@200;300;400;500;600&display=swap" rel="stylesheet">

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

@page {
    size: A4;
    margin: 15mm;
}

body {
    background: #fcfbfa;
    color: #1d1416; /* Espresso Cocoa dark text instead of harsh solid black */
    font-size: 11px;
    line-height: 1.6;
    padding: 10px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
}

.invoice-container {
    width: 100%;
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #eae7e2;
    box-shadow: 0 4px 30px rgba(29, 20, 22, 0.02);
}

/* ================= HEADER ================= */
.header {
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32px 40px;
    border-bottom: 1px solid #eae7e2;
}

.brand h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 300;
    letter-spacing: 2px;
    margin-bottom: 4px;
}

.brand p {
    font-family: 'Montserrat', sans-serif;
    font-size: 9px;
    color: #6A0F1F; /* Luxury Wine-Red */
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-top: 4px;
}

.invoice-meta {
    text-align: right;
}

.invoice-meta h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 300;
    letter-spacing: 3px;
    color: #6A0F1F;
    margin-bottom: 8px;
    text-transform: uppercase;
}

.invoice-meta p {
    margin: 4px 0;
    color: #555;
    font-size: 10px;
    letter-spacing: 0.5px;
}

.badge {
    display: inline-block;
    background: #6A0F1F;
    color: #fff;
    padding: 4px 12px;
    border-radius: 2px;
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 8px;
}

/* ================= BILLING DETAILS ================= */
.section {
    padding: 24px 40px;
}

.cards {
    display: flex;
    gap: 24px;
}

.card {
    flex: 1;
    background: #fff;
    border: 1px solid #eae7e2;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(29, 20, 22, 0.01);
}

.card-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 9px;
    text-transform: uppercase;
    font-weight: 600;
    color: #6A0F1F;
    margin-bottom: 12px;
    letter-spacing: 2px;
    border-bottom: 1px solid #eae7e2;
    pb-1;
}

.card strong {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    font-weight: 400;
    color: #1d1416;
}

.card p {
    color: #555;
    line-height: 1.7;
    margin-top: 8px;
    font-size: 10.5px;
}

/* ================= TABLE ================= */
table {
    width: 100%;
    border-collapse: collapse;
}

thead {
    border-top: 1px solid #1d1416;
    border-bottom: 1px solid #1d1416;
}

th {
    padding: 14px 12px;
    font-family: 'Montserrat', sans-serif;
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-align: left;
    color: #1d1416;
}

td {
    padding: 16px 12px;
    border-bottom: 1px solid #eae7e2;
    vertical-align: top;
    color: #444;
    font-size: 10.5px;
}

tbody tr:nth-child(even) {
    background: #faf9f6; /* Subtle ivory bar background */
}

.product-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px;
    font-weight: 400;
    color: #1d1416;
    margin-bottom: 4px;
}

.variant {
    color: #777;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

/* ================= TOTALS SUMMARY ================= */
.total-wrapper {
    display: flex;
    justify-content: flex-end;
    padding: 10px 40px 32px;
}

.total-card {
    width: 320px;
    border: 1px solid #eae7e2;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
}

.total-row {
    display: flex;
    justify-content: space-between;
    padding: 11px 18px;
    border-bottom: 1px solid #eae7e2;
    font-size: 11px;
    color: #555;
}

.total-row:last-child {
    border-bottom: none;
}

.total-row:nth-child(even) {
    background: #faf9f6;
}

.grand-total {
    background: #1d1416; /* Espresso Cocoa background */
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1.5px;
}

.grand-total span:last-child {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    font-weight: 600;
    color: #e4e198; /* Gold-Ivory grand total */
}

/* ================= PAYMENT INFORMATION ================= */
.payment {
    display: flex;
    gap: 24px;
    padding: 0 40px 32px;
    page-break-inside: avoid;
    break-inside: avoid;
}

.payment-card {
    flex: 1;
    border: 1px solid #eae7e2;
    border-radius: 8px;
    padding: 20px;
    background: #fff;
    page-break-inside: avoid;
    break-inside: avoid;
    box-shadow: 0 2px 12px rgba(29, 20, 22, 0.01);
}

.payment-card table {
    width: 100%;
    border-collapse: collapse;
}

.payment-card td {
    border: none;
    padding: 8px 0;
    font-size: 10.5px;
    color: #555;
}

.payment-card tr {
    border-bottom: 1px dashed #eae7e2;
}

.payment-card tr:last-child {
    border-bottom: none;
}

.status-paid {
    display: inline-block;
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    padding: 3px 10px;
    border-radius: 2px;
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 1px;
}

.status-pending {
    display: inline-block;
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
    padding: 3px 10px;
    border-radius: 2px;
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 1px;
}

/* ================= FOOTER ================= */
.footer {
    background: #1d1416;
    color: #faf9f6;
    text-align: center;
    padding: 28px 40px;
    font-size: 10px;
    line-height: 1.8;
    letter-spacing: 1px;
    font-weight: 200;
}

.footer strong {
    color: #e4e198; /* Gold highlight */
    font-weight: 400;
    letter-spacing: 1.5px;
    text-transform: uppercase;
}

.footer a {
    color: #faf9f6;
    text-decoration: underline;
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
            <img src="${COMPANY.logo}" style="height:50px;object-fit:contain;margin-bottom:4px;" />
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
            <table>
                <tr>
                    <td style="width:35%;"><strong>Transaction ID</strong></td>
                    <td style="color:#1d1416;font-weight:400;">${transactionNumber}</td>
                </tr>
                <tr>
                    <td><strong>Payment Gateway</strong></td>
                    <td style="color:#1d1416;font-weight:400;">${paymentProvider}</td>
                </tr>
                <tr>
                    <td><strong>Payment ID</strong></td>
                    <td style="color:#1d1416;font-weight:400;">${paymentId}</td>
                </tr>
                <tr>
                    <td><strong>Payment Method</strong></td>
                    <td style="color:#6A0F1F;font-weight:500;text-transform:uppercase;">${paymentMethodName}</td>
                </tr>
                <tr>
                    <td><strong>Payment Status</strong></td>
                    <td>
                        <span class="${paymentStatusClass}">
                            ${paymentStatusText}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td><strong>Currency</strong></td>
                    <td style="color:#1d1416;font-weight:400;">${transaction?.currency ?? "INR"}</td>
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
