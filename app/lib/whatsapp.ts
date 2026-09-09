export const WHATSAPP_NUMBER = "919910953926"; // Replace with your number

export const createWhatsAppLink = (message: string) => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const whatsappMessages = {
  home: () => `
Hi VastraDrobe,

I'm looking for some recommendations.
`,

  contact: () => `
Hi,

I have a question regarding VastraDrobe.
`,

  cart: (total: number) => `
Hi,

I need help with my cart.

Cart Total: ₹${total}
`,

  product: (name: string, color?: string, size?: string, url?: string) => `
Hi VastraDrobe,

I'm interested in this product.

Product: ${name}
${color ? `Color: ${color}` : ""}
${size ? `Size: ${size}` : ""}
${url ? `Product Link: ${url}` : ""}

Can you help me?
`,

  order: (orderId: string) => `
Hi,

I need help regarding my order.

Order ID: ${orderId}
`,
};
