import nodemailer from "nodemailer";

const NOTIFY_TO = "rouhullahsayed@gmail.com";

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST ?? "smtp-relay.brevo.com",
    port: Number(process.env.BREVO_SMTP_PORT ?? 587),
    secure: false, // STARTTLS
    auth: {
      user: process.env.BREVO_SMTP_USER ?? "",
      pass: process.env.BREVO_SMTP_KEY ?? "",
    },
  });
}

export async function sendOrderNotification(order: {
  orderId: string;
  items: { id: string; qty: number }[];
  shipping: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    country: string;
  };
  coupon?: string | null;
}) {
  const { orderId, items, shipping, coupon } = order;
  const rows = items
    .map((i) => `<tr><td style="padding:4px 8px">${i.id}</td><td style="padding:4px 8px;text-align:center">${i.qty}</td></tr>`)
    .join("");

  const html = `
<h2 style="color:#1a3a1a">🌾 New Order — ${orderId}</h2>
<h3>Shipping details</h3>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
  <tr><td style="padding:4px 8px;color:#666">Name</td><td style="padding:4px 8px"><b>${shipping.name}</b></td></tr>
  <tr><td style="padding:4px 8px;color:#666">Email</td><td style="padding:4px 8px">${shipping.email}</td></tr>
  <tr><td style="padding:4px 8px;color:#666">Phone</td><td style="padding:4px 8px">${shipping.phone || "—"}</td></tr>
  <tr><td style="padding:4px 8px;color:#666">Address</td><td style="padding:4px 8px">${shipping.address}, ${shipping.city} ${shipping.zip}</td></tr>
  <tr><td style="padding:4px 8px;color:#666">Country</td><td style="padding:4px 8px">${shipping.country}</td></tr>
  ${coupon ? `<tr><td style="padding:4px 8px;color:#666">Coupon</td><td style="padding:4px 8px">${coupon}</td></tr>` : ""}
</table>
<h3>Items</h3>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
  <thead><tr style="background:#f0f0e8"><th style="padding:4px 8px;text-align:left">Product ID</th><th style="padding:4px 8px">Qty</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
<p style="color:#888;font-size:12px;margin-top:24px">Order ID: ${orderId}</p>
`;

  const text = [
    `New Order: ${orderId}`,
    ``,
    `Shipping`,
    `  Name:    ${shipping.name}`,
    `  Email:   ${shipping.email}`,
    `  Phone:   ${shipping.phone || "—"}`,
    `  Address: ${shipping.address}, ${shipping.city} ${shipping.zip}, ${shipping.country}`,
    coupon ? `  Coupon:  ${coupon}` : "",
    ``,
    `Items`,
    ...items.map((i) => `  ${i.id} × ${i.qty}`),
  ]
    .filter((l) => l !== undefined)
    .join("\n");

  await createTransport().sendMail({
    from: `"Dehqan Farms" <${process.env.BREVO_SMTP_USER}>`,
    to: NOTIFY_TO,
    subject: `🌾 New Order – ${orderId}`,
    html,
    text,
  });
}

export async function sendInquiryNotification(inquiry: {
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  country?: string | null;
  products?: string | null;
  quantity?: string | null;
  message?: string | null;
}) {
  const { name, company, email, phone, country, products, quantity, message } = inquiry;

  const html = `
<h2 style="color:#1a3a1a">📬 New Wholesale Inquiry</h2>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
  <tr><td style="padding:4px 8px;color:#666">Name</td><td style="padding:4px 8px"><b>${name}</b></td></tr>
  ${company ? `<tr><td style="padding:4px 8px;color:#666">Company</td><td style="padding:4px 8px">${company}</td></tr>` : ""}
  <tr><td style="padding:4px 8px;color:#666">Email</td><td style="padding:4px 8px"><a href="mailto:${email}">${email}</a></td></tr>
  ${phone ? `<tr><td style="padding:4px 8px;color:#666">Phone</td><td style="padding:4px 8px">${phone}</td></tr>` : ""}
  ${country ? `<tr><td style="padding:4px 8px;color:#666">Country</td><td style="padding:4px 8px">${country}</td></tr>` : ""}
  ${products ? `<tr><td style="padding:4px 8px;color:#666">Products</td><td style="padding:4px 8px">${products}</td></tr>` : ""}
  ${quantity ? `<tr><td style="padding:4px 8px;color:#666">Quantity</td><td style="padding:4px 8px">${quantity}</td></tr>` : ""}
</table>
${message ? `<h3>Message</h3><p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${message}</p>` : ""}
`;

  const text = [
    "New Wholesale Inquiry",
    "",
    `Name:     ${name}`,
    company ? `Company:  ${company}` : "",
    `Email:    ${email}`,
    phone ? `Phone:    ${phone}` : "",
    country ? `Country:  ${country}` : "",
    products ? `Products: ${products}` : "",
    quantity ? `Quantity: ${quantity}` : "",
    message ? `\nMessage:\n${message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  await createTransport().sendMail({
    from: `"Dehqan Farms" <${process.env.BREVO_SMTP_USER}>`,
    to: NOTIFY_TO,
    subject: `📬 New Inquiry from ${name}${company ? ` – ${company}` : ""}`,
    html,
    text,
  });
}

