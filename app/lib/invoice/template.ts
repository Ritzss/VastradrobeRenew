/* eslint-disable @typescript-eslint/no-explicit-any */
import { COMPANY } from "./company";
import { Order } from "@/Types/Order";

export function invoiceTemplate(order: Order) {
  const transaction = order.transactionId as any;

  return `
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:"Segoe UI",Arial,sans-serif;
}

@page{
    size:A4;
    margin:15mm;
}

body{
    background:#f3f3f3;
    color:#222;
    font-size:12px;
    line-height:1.45;
    padding:15px;
}

.invoice-container{
    width:100%;
    background:#fff;
    border-radius:12px;
    overflow:hidden;
    border:1px solid #ddd;
}

/* ================= HEADER ================= */

.header{
    background:#111;
    color:#fff;
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:18px 28px;
    border-bottom:5px solid #8B0000;
}

.brand h1{
    font-size:30px;
    letter-spacing:1px;
    margin-bottom:4px;
}

.brand p{
    font-size:12px;
    color:#ddd;
}

.invoice-meta{
    text-align:right;
}

.invoice-meta h2{
    font-size:24px;
    margin-top:8px;
    margin-bottom:8px;
}

.invoice-meta p{
    margin:2px 0;
}

.badge{
    display:inline-block;
    background:#8B0000;
    color:#fff;
    padding:6px 16px;
    border-radius:50px;
    font-size:11px;
    font-weight:700;
    letter-spacing:1px;
}

/* ================= COMMON ================= */

.section{
    padding:18px 28px;
}

.cards{
    display:flex;
    gap:18px;
}

.card{
    flex:1;
    background:#fafafa;
    border:1px solid #e8e8e8;
    border-left:5px solid #8B0000;
    border-radius:10px;
    padding:16px;
}

.card-title{
    font-size:11px;
    text-transform:uppercase;
    font-weight:700;
    color:#8B0000;
    margin-bottom:10px;
    letter-spacing:1px;
}

.card strong{
    font-size:15px;
}

/* ================= TABLE ================= */

table{
    width:100%;
    border-collapse:collapse;
}

thead{
    background:#8B0000;
    color:#fff;
}

th{
    padding:11px;
    font-size:12px;
    text-align:left;
}

td{
    padding:10px;
    border-bottom:1px solid #ececec;
    vertical-align:top;
}

tbody tr:nth-child(even){
    background:#fafafa;
}

.product-name{
    font-weight:600;
    margin-bottom:2px;
}

.variant{
    color:#777;
    font-size:11px;
}

/* ================= TOTAL ================= */

.total-wrapper{
    display:flex;
    justify-content:flex-end;
    padding:5px 28px 18px;
}

.total-card{
    width:310px;
    border:1px solid #ddd;
    border-radius:10px;
    overflow:hidden;
}

.total-row{
    display:flex;
    justify-content:space-between;
    padding:10px 16px;
    border-bottom:1px solid #eee;
    font-size:12px;
}

.total-row:last-child{
    border-bottom:none;
}

.total-row:nth-child(even){
    background:#fafafa;
}

.grand-total{
    background:#111;
    color:#fff;
    font-size:16px;
    font-weight:bold;
}

/* ================= PAYMENT ================= */

.payment{
    display:flex;
    gap:18px;
    padding:0 28px 18px;
    page-break-inside: avoid;
    break-inside: avoid;
}

.payment-card{
    flex:1;
    border:1px solid #ddd;
    border-radius:10px;
    padding:15px;
    page-break-inside: avoid;
    break-inside: avoid;
}

.status-paid{
    display:inline-block;
    background:#111;
    color:#fff;
    padding:6px 14px;
    border-radius:50px;
    font-size:11px;
    font-weight:bold;
}

.status-pending{
    display:inline-block;
    background:#8B0000;
    color:#fff;
    padding:6px 14px;
    border-radius:50px;
    font-size:11px;
    font-weight:bold;
}

/* ================= FOOTER ================= */

.footer{
    background:#111;
    color:#fff;
    text-align:center;
    padding:16px 28px;
    font-size:11px;
    line-height:1.6;
}

.footer strong{
    color:#fff;
}

.footer a{
    color:#fff;
    text-decoration:none;
}

/* ================= PRINT ================= */

thead{
    display:table-header-group;
}

tr{
    page-break-inside:avoid;
}

img{
    max-width:100%;
}

.logo{
    height:55px;
    width:auto;
}

.small{
    font-size:11px;
    color:#777;
}

.page-break{
    page-break-before: always;
    break-before: page;
}



</style>

</head>

<body>

<div class="invoice-container">

    <div class="header">

        <div class="brand">

<img
src="${COMPANY.logo}"
style="height:60px;object-fit:contain;"
/>

<p>${COMPANY.tagline}</p>

</div>

        <div class="invoice-meta">

            <div class="badge">
                ${order.paymentStatus === "Paid" ? "PAID" : "PENDING"}
            </div>

            <h2>TAX INVOICE</h2>

            <p><strong>Invoice :</strong> ${order.invoiceNumber}</p>

            <p><strong>Order :</strong> ${order.orderNumber}</p>

            <p>${new Date(order.createdAt).toLocaleDateString("en-IN")}</p>

        </div>

    </div>





    <div class="section">

        <div class="cards">

            <div class="card">

                <div class="card-title">
                    Sold By
                </div>

                <strong>${COMPANY.name}</strong>

                <br><br>

                ${COMPANY.address.join("<br>")}

                <br><br>

                📞 ${COMPANY.phone}

                <br>

                ✉️ ${COMPANY.email}

                <br>

                GSTIN : ${COMPANY.gst}

            </div>





            <div class="card">

                <div class="card-title">
                    Bill To
                </div>

                <strong>${order.deliveryAddress.name ?? "Customer"}</strong>

                <br><br>

                ${order.deliveryAddress.address}

                <br>

                ${order.deliveryAddress.city ?? ""}

                ${order.deliveryAddress.state ?? ""}

                ${order.deliveryAddress.pincode ?? ""}

                <br><br>

                📞 ${order.deliveryAddress.phone}

                <br>

                ✉️ ${order.deliveryAddress.email ?? ""}

            </div>

        </div>

    </div>





    <div class="section">

        <table>

            <thead>

                <tr>

                    <th style="width:50%">Product</th>

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

                        <div class="product-name">

                            ${item.name}

                        </div>

                        <div class="variant">

                            ${item.color ?? "-"}

                            &nbsp;|&nbsp;

                            Size ${item.size}

                            ${item.sku ? `&nbsp;|&nbsp;SKU : ${item.sku}` : ""}

                        </div>

                    </td>

                    <td>

                        ${item.quantity}

                    </td>

                    <td>

                        ₹${item.price}

                    </td>

                    <td>

                        ₹${item.total}

                    </td>

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

                <strong>

                    ₹${order.discount}

                </strong>

            </div>

            <div class="total-row">

                <span>GST</span>

                <strong>

                    ₹${order.tax}

                </strong>

            </div>

            <div class="total-row grand-total">

                <span>Grand Total</span>

                <span>

                    ₹${order.totalAmount}

                </span>

            </div>

        </div>

    </div>


<div class="page-break"></div>


    <div class="payment">

    <div class="payment-card">

        <div class="card-title">
            Payment Details
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:12px">

            <tr>
                <td><strong>Transaction</strong></td>
                <td>${transaction?.transactionNumber ?? "-"}</td>
            </tr>

            <tr>
                <td><strong>Gateway</strong></td>
                <td>${transaction?.provider ?? "-"}</td>
            </tr>

            <tr>
                <td><strong>Payment ID</strong></td>
                <td>${transaction?.razorpayPaymentId ?? "-"}</td>
            </tr>

            <tr>
                <td><strong>Method</strong></td>
                <td>${transaction?.paymentMethod ?? "-"}</td>
            </tr>

            <tr>
                <td><strong>Status</strong></td>
                <td>
                    <span class="${
                      transaction?.status === "paid"
                        ? "status-paid"
                        : "status-pending"
                    }">
                        ${transaction?.status?.toUpperCase() ?? "-"}
                    </span>
                </td>
            </tr>

            <tr>
                <td><strong>Currency</strong></td>
                <td>${transaction?.currency ?? "INR"}</td>
            </tr>

        </table>

    </div>

</div>





    <div class="footer">

        <strong>

            Thank you for shopping with VastraDrobe ❤️

        </strong>

        <br><br>

        This is a computer generated invoice and does not require a signature.

        <br>

        For support contact

        <strong>${COMPANY.email}</strong>

        or visit

        <strong>${COMPANY.website}</strong>

    </div>

</div>

</body>

</html>
`;
}
