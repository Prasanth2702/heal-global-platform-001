// export const generateBillPDF = async (bill: any, facilityInfo: any, patientInfo: any) => {
//   // Dynamically import html2pdf.js
//   const html2pdf = (await import('html2pdf.js')).default

//   const billHTML = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <title>Bill ${bill.bill_number}</title>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           margin: 0;
//           padding: 20px;
//           color: #333;
//         }
//         .header {
//           text-align: center;
//           margin-bottom: 30px;
//           padding-bottom: 20px;
//           border-bottom: 2px solid #333;
//         }
//         .hospital-name {
//           font-size: 24px;
//           font-weight: bold;
//           margin-bottom: 5px;
//         }
//         .hospital-details {
//           font-size: 12px;
//           color: #666;
//         }
//         .bill-title {
//           font-size: 20px;
//           font-weight: bold;
//           margin: 20px 0;
//           text-align: center;
//         }
//         .info-section {
//           margin-bottom: 20px;
//           padding: 10px;
//           background: #f9f9f9;
//         }
//         .info-row {
//           display: flex;
//           margin-bottom: 8px;
//         }
//         .info-label {
//           width: 120px;
//           font-weight: bold;
//         }
//         .info-value {
//           flex: 1;
//         }
//         table {
//           width: 100%;
//           border-collapse: collapse;
//           margin: 20px 0;
//         }
//         th, td {
//           border: 1px solid #ddd;
//           padding: 10px;
//           text-align: left;
//         }
//         th {
//           background-color: #f2f2f2;
//           font-weight: bold;
//         }
//         .totals {
//           margin-top: 20px;
//           text-align: right;
//         }
//         .totals-row {
//           margin-bottom: 5px;
//         }
//         .grand-total {
//           font-size: 18px;
//           font-weight: bold;
//           margin-top: 10px;
//           padding-top: 10px;
//           border-top: 2px solid #333;
//         }
//         .footer {
//           margin-top: 50px;
//           text-align: center;
//           font-size: 10px;
//           color: #999;
//           border-top: 1px solid #ddd;
//           padding-top: 20px;
//         }
//         .payment-details {
//           margin-top: 20px;
//           padding: 10px;
//           background: #f0f8ff;
//         }
//         .discount-details {
//           margin-top: 10px;
//           padding: 10px;
//           background: #fff3e0;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="header">
//         <div class="hospital-name">${facilityInfo?.facility_name || 'Hospital Name'}</div>
//         <div class="hospital-details">
//           ${facilityInfo?.address || ''}<br>
//           ${facilityInfo?.city || ''}, ${facilityInfo?.state || ''} - ${facilityInfo?.pincode || ''}<br>
//           License: ${facilityInfo?.license_number || 'N/A'}
//         </div>
//       </div>

//       <div class="bill-title">TAX INVOICE / BILL</div>

//       <div class="info-section">
//         <div class="info-row">
//           <div class="info-label">Bill No:</div>
//           <div class="info-value">${bill.bill_number}</div>
//         </div>
//         <div class="info-row">
//           <div class="info-label">Bill Date:</div>
//           <div class="info-value">${new Date(bill.bill_date).toLocaleDateString()}</div>
//         </div>
//         <div class="info-row">
//           <div class="info-label">Payment Status:</div>
//           <div class="info-value">${bill.payment_status.toUpperCase()}</div>
//         </div>
//       </div>

//       <div class="info-section">
//         <div class="info-row">
//           <div class="info-label">Patient Name:</div>
//           <div class="info-value">${patientInfo?.first_name || ''} ${patientInfo?.last_name || ''}</div>
//         </div>
//         <div class="info-row">
//           <div class="info-label">Patient ID:</div>
//           <div class="info-value">${patientInfo?.user_id || bill.patient_id}</div>
//         </div>
//         <div class="info-row">
//           <div class="info-label">Email:</div>
//           <div class="info-value">${patientInfo?.email || 'N/A'}</div>
//         </div>
//         <div class="info-row">
//           <div class="info-label">Phone:</div>
//           <div class="info-value">${patientInfo?.phone_number || 'N/A'}</div>
//         </div>
//       </div>

//       <table>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Description</th>
//             <th>Quantity</th>
//             <th>Unit Price (₹)</th>
//             <th>Total (₹)</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${bill.items.map((item: any, index: number) => `
//             <tr>
//               <td>${index + 1}</td>
//               <td>${item.item_name || 'Item'}</td>
//               <td>${item.quantity}</td>
//               <td>₹${item.unit_price.toFixed(2)}</td>
//               <td>₹${item.total_price.toFixed(2)}</td>
//             </tr>
//           `).join('')}
//         </tbody>
//       </table>

//       <div class="totals">
//         <div class="totals-row">Subtotal: ₹${bill.subtotal.toFixed(2)}</div>
//         ${bill.discount_amount > 0 ? `
//           <div class="discount-details">
//             <div>Discount: ${bill.discount_percentage}% (₹${bill.discount_amount.toFixed(2)})</div>
//             ${bill.discount_approver_name ? <div>Approved by: ${bill.discount_approver_name}</div> : ''}
//             ${bill.discount_reason ? <div>Reason: ${bill.discount_reason}</div> : ''}
//           </div>
//         ` : ''}
//         <div class="grand-total">Total Amount: ₹${bill.total_amount.toFixed(2)}</div>
//       </div>

//       ${bill.payments && bill.payments.length > 0 ? `
//         <div class="payment-details">
//           <h4>Payment Details</h4>
//           ${bill.payments.map((payment: any) => `
//             <div class="info-row">
//               <div class="info-label">Method:</div>
//               <div class="info-value">${payment.payment_method.toUpperCase()}</div>
//             </div>
//             <div class="info-row">
//               <div class="info-label">Amount:</div>
//               <div class="info-value">₹${payment.amount.toFixed(2)}</div>
//             </div>
//             <div class="info-row">
//               <div class="info-label">Date:</div>
//               <div class="info-value">${new Date(payment.payment_date).toLocaleString()}</div>
//             </div>
//             ${payment.transaction_id ? `
//               <div class="info-row">
//                 <div class="info-label">Transaction ID:</div>
//                 <div class="info-value">${payment.transaction_id}</div>
//               </div>
//             ` : ''}
//           `).join('')}
//         </div>
//       ` : ''}

//       ${bill.notes ? `
//         <div class="info-section">
//           <div class="info-label">Notes:</div>
//           <div class="info-value">${bill.notes}</div>
//         </div>
//       ` : ''}

//       <div class="footer">
//         This is a computer generated invoice and does not require a signature.<br>
//         Thank you for your visit!
//       </div>
//     </body>
//     </html>
//   `

//   const element = document.createElement('div')
//   element.innerHTML = billHTML
//   document.body.appendChild(element)

//   const opt = {
//     margin: [0.5, 0.5, 0.5, 0.5],
//     filename: Bill_${bill.bill_number}.pdf,
//     image: { type: 'jpeg', quality: 0.98 },
//     html2canvas: { scale: 2, letterRendering: true },
//     jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
//   }

//   await html2pdf().set(opt).from(element).save()
//   document.body.removeChild(element)
// }

export const generateBillPDF = async (
  bill: any,
  facilityInfo: any,
  patientInfo: any
) => {
  const html2pdf = (await import("html2pdf.js")).default;

  const billHTML = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Bill ${bill.bill_number}</title>

<style>
body{
font-family: Arial, sans-serif;
margin:0;
padding:20px;
color:#333;
}

.header{
text-align:center;
margin-bottom:30px;
padding-bottom:20px;
border-bottom:2px solid #333;
}

.hospital-name{
font-size:24px;
font-weight:bold;
margin-bottom:5px;
}

.hospital-details{
font-size:12px;
color:#666;
}

.bill-title{
font-size:20px;
font-weight:bold;
margin:20px 0;
text-align:center;
}

.info-section{
margin-bottom:20px;
padding:10px;
background:#f9f9f9;
}

.info-row{
display:flex;
margin-bottom:8px;
}

.info-label{
width:140px;
font-weight:bold;
}

.info-value{
flex:1;
}

table{
width:100%;
border-collapse:collapse;
margin:20px 0;
}

th,td{
border:1px solid #ddd;
padding:10px;
text-align:left;
}

th{
background:#f2f2f2;
}

.totals{
margin-top:20px;
text-align:right;
}

.grand-total{
font-size:18px;
font-weight:bold;
margin-top:10px;
padding-top:10px;
border-top:2px solid #333;
}

.footer{
margin-top:50px;
text-align:center;
font-size:10px;
color:#999;
border-top:1px solid #ddd;
padding-top:20px;
}

.payment-details{
margin-top:20px;
padding:10px;
background:#f0f8ff;
}

.discount-details{
margin-top:10px;
padding:10px;
background:#fff3e0;
}
</style>

</head>

<body>

<div class="header">
<div class="hospital-name">
${facilityInfo?.facility_name || "Hospital"}
</div>

<div class="hospital-details">
${facilityInfo?.address || ""}<br/>
${facilityInfo?.city || ""}, ${facilityInfo?.state || ""} - ${
    facilityInfo?.pincode || ""
  }<br/>
License : ${facilityInfo?.license_number || ""}
</div>
</div>

<div class="bill-title">
BILL
</div>

<div class="info-section">

<div class="info-row">
<div class="info-label">Bill No :</div>
<div class="info-value">${bill.bill_number}</div>
</div>

<div class="info-row">
<div class="info-label">Bill Date :</div>
<div class="info-value">
${new Date(bill.bill_date).toLocaleDateString()}
</div>
</div>

<div class="info-row">
<div class="info-label">Status :</div>
<div class="info-value">
${bill.payment_status?.toUpperCase()}
</div>
</div>

</div>

<div class="info-section">

<div class="info-row">
<div class="info-label">Patient Name :</div>
<div class="info-value">
${patientInfo?.first_name || ""} ${patientInfo?.last_name || ""}
</div>
</div>

<div class="info-row">
<div class="info-label">Email :</div>
<div class="info-value">
${patientInfo?.email || "N/A"}
</div>
</div>

<div class="info-row">
<div class="info-label">Phone :</div>
<div class="info-value">
${patientInfo?.phone_number || "N/A"}
</div>
</div>

</div>

<table>

<thead>
<tr>
<th>#</th>
<th>Description</th>
<th>Qty</th>
<th>Price</th>
<th>Total</th>
</tr>
</thead>

<tbody>

${bill.items
  .map(
    (item: any, index: number) => `
<tr>
<td>${index + 1}</td>
<td>${item.item_name}</td>
<td>${item.quantity}</td>
<td>₹${item.unit_price.toFixed(2)}</td>
<td>₹${item.total_price.toFixed(2)}</td>
</tr>
`
  )
  .join("")}

</tbody>

</table>

<div class="totals">

<div>Subtotal : ₹${bill.subtotal.toFixed(2)}</div>

${
  bill.discount_amount > 0
    ? `
<div class="discount-details">
<div>Discount : ${bill.discount_percentage}%</div>
${
  bill.discount_approver_name
    ? `<div>Approved by : ${bill.discount_approver_name}</div>`
    : ""
}
${
  bill.discount_reason
    ? `<div>Reason : ${bill.discount_reason}</div>`
    : ""
}
</div>
`
    : ""
}

<div class="grand-total">
Total : ₹${bill.total_amount.toFixed(2)}
</div>

</div>

${
  bill.payments?.length > 0
    ? `
<div class="payment-details">
<h4>Payment Details</h4>

${bill.payments
  .map(
    (p: any) => `
<div class="info-row">
<div class="info-label">Method :</div>
<div class="info-value">${p.payment_method}</div>
</div>

<div class="info-row">
<div class="info-label">Amount :</div>
<div class="info-value">₹${p.amount}</div>
</div>

<div class="info-row">
<div class="info-label">Date :</div>
<div class="info-value">
${new Date(p.payment_date).toLocaleString()}
</div>
</div>
`
  )
  .join("")}

</div>
`
    : ""
}

<div class="footer">
Computer generated bill — No signature required
</div>

</body>
</html>
`;

  const element = document.createElement("div");
  element.innerHTML = billHTML;

  document.body.appendChild(element);

  // const opt = {
  //   margin: 0.5,
  //   filename: `Bill_${bill.bill_number}.pdf`,
  //   image: { type: "jpeg", quality: 0.98 },
  //   html2canvas: { scale: 2 },
  //   jsPDF: {
  //     unit: "in",
  //     format: "a4",
  //     orientation: "portrait",
  //   },
  // };
  const opt = {
  margin: 0.5,
  filename: 'bill.pdf',
  image: {
    type: 'jpeg' as const,
    quality: 0.98,
  },
  html2canvas: {
    scale: 2,
  },
  jsPDF: {
    unit: 'in' as const,
    format: 'a4' as const,
    orientation: 'portrait' as const,
  },
};

  await html2pdf().set(opt).from(element).save();

  document.body.removeChild(element);
};

// <div class="info-row">
// <div class="info-label">Patient ID :</div>
// <div class="info-value">
// ${patientInfo?.user_id || bill.patient_id}
// </div>
// </div>

// <div class="bill-title">
// TAX INVOICE / BILL
// </div>