/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

export const fbPixel = {
  pageView: () => {
    window.fbq?.("track", "PageView");
  },

  viewContent: ({
    id,
    name,
    price,
  }: {
    id: string;
    name: string;
    price: number;
  }) => {
    window.fbq?.("track", "ViewContent", {
      content_ids: [id],
      content_name: name,
      content_type: "product",
      value: price,
      currency: "INR",
    });
  },

  addToCart: ({
    id,
    name,
    price,
    quantity = 1,
  }: {
    id: string;
    name: string;
    price: number;
    quantity?: number;
  }) => {
    window.fbq?.("track", "AddToCart", {
      content_ids: [id],
      content_name: name,
      content_type: "product",
      value: price * quantity,
      currency: "INR",
      quantity,
    });
  },

  addToWishlist: ({
    id,
    name,
    price,
  }: {
    id: string;
    name: string;
    price: number;
  }) => {
    window.fbq?.("track", "AddToWishlist", {
      content_ids: [id],
      content_name: name,
      value: price,
      currency: "INR",
    });
  },

  search: (query: string) => {
    window.fbq?.("track", "Search", {
      search_string: query,
    });
  },

  initiateCheckout: ({
    total,
    itemCount,
  }: {
    total: number;
    itemCount: number;
  }) => {
    window.fbq?.("track", "InitiateCheckout", {
      value: total,
      currency: "INR",
      num_items: itemCount,
    });
  },

  addPaymentInfo: ({
    total,
  }: {
    total: number;
  }) => {
    window.fbq?.("track", "AddPaymentInfo", {
      value: total,
      currency: "INR",
    });
  },

  purchase: ({
    orderId,
    total,
    products,
  }: {
    orderId: string;
    total: number;
    products: string[];
  }) => {
    window.fbq?.("track", "Purchase", {
      transaction_id: orderId,
      value: total,
      currency: "INR",
      content_ids: products,
      content_type: "product",
    });
  },

  completeRegistration: () => {
    window.fbq?.("track", "CompleteRegistration");
  },

  lead: () => {
    window.fbq?.("track", "Lead");
  },

  contact: () => {
    window.fbq?.("track", "Contact");
  },

  custom: (eventName: string, data = {}) => {
    window.fbq?.("track", eventName, data);
  },
};