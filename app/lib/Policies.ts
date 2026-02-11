export interface PolicySection {
  type: "heading" | "paragraph" | "list" | "images";
  value?: string;
  items?: string[];
  src?: string;
}

export interface PolicyItem {
  title: string;
  slug: string;
  description?: string;
  content: PolicySection[];
}

export const policies: PolicyItem[] = [
  {
    title: "Returns & Refunds",
    slug: "returns-and-refunds",
    description: "Everything you need to know about returning your order.",
    content: [
      {
        type: "heading",
        value: "Return Eligibility",
      },
      {
        type: "paragraph",
        value:
          "Items can be returned within 7 days of delivery if unused and in original packaging.",
      },
      {
        type: "list",
        items: [
          "Product must be unused and unwashed",
          "Original tags must be intact",
          "Return request must be initiated within 7 days",
        ],
      },
      {
        type: "heading",
        value: "Refund Timeline",
      },
      {
        type: "paragraph",
        value:
          "Refunds are processed within 5–7 business days after the returned item is received and inspected.",
      },
    ],
  },
  {
    title: "Shipping",
    slug: "shipping",
    description: "Delivery timelines, charges, and order processing details.",
    content: [
      {
        type: "heading",
        value: "Processing Time",
      },
      {
        type: "paragraph",
        value:
          "All orders are processed within 1–3 business days. Orders placed on weekends or holidays are processed on the next working day.",
      },
      {
        type: "heading",
        value: "Delivery Timeline",
      },
      {
        type: "list",
        items: [
          "Metro cities: 3–5 business days",
          "Non-metro locations: 5–7 business days",
          "Remote areas: 7–10 business days",
        ],
      },
      {
        type: "heading",
        value: "Shipping Charges",
      },
      {
        type: "paragraph",
        value:
          "Shipping is free on prepaid orders above ₹999. A nominal charge may apply for Cash on Delivery orders.",
      },
      {
        type: "heading",
        value: "Order Tracking",
      },
      {
        type: "paragraph",
        value:
          "Once your order is shipped, you will receive tracking details via SMS and email. You can also track your order from your account dashboard.",
      },
    ],
  },
  {
    title: "Size Guide",
    slug: "size-guide",
    description: "Find your perfect fit with our detailed sizing information.",
    content: [
      {
        type: "heading",
        value: "How to Measure",
      },
      {
        type: "list",
        items: [
          "Bust: Measure around the fullest part of your chest.",
          "Waist: Measure around your natural waistline.",
          "Hip: Measure around the widest part of your hips.",
          "Length: Measure from shoulder to desired garment length.",
        ],
      },
      {
        type: "heading",
        value: "General Fit Advice",
      },
      {
        type: "paragraph",
        value:
          "Our garments are designed with comfort and structure in mind. If you're between sizes, we recommend choosing the larger size for a relaxed fit.",
      },
      {
        type: "heading",
        value: "Still Unsure?",
      },
      {
        type: "paragraph",
        value:
          "Reach out to our support team with your measurements, and we’ll help you choose the right size.",
      },
    ],
  },
  {
    title: "FAQs",
    slug: "faqs",
    description: "Common questions about orders, products, and policies.",
    content: [
      {
        type: "heading",
        value: "Can I cancel my order?",
      },
      {
        type: "paragraph",
        value:
          "Orders can be canceled within 24 hours of placement if they have not been shipped.",
      },
      {
        type: "heading",
        value: "Do you offer Cash on Delivery?",
      },
      {
        type: "paragraph",
        value: "Yes, Cash on Delivery is available for select locations.",
      },
      {
        type: "heading",
        value: "How do I initiate a return?",
      },
      {
        type: "paragraph",
        value:
          "Log into your account, go to Orders, and select 'Request Return'. Our team will guide you through the process.",
      },
      {
        type: "heading",
        value: "Are your fabrics sustainable?",
      },
      {
        type: "paragraph",
        value:
          "We prioritize breathable, durable fabrics and are continuously working toward more sustainable sourcing practices.",
      },
    ],
  },
  {
    title: "Information",
    slug: "information",
    description: "Everything you need to know about shopping with VastraDrobe.",
    content: [
      {
        type: "heading",
        value: "About VastraDrobe",
      },
      {
        type: "paragraph",
        value:
        "VastraDrobe is built around breathable fabrics, thoughtful silhouettes, and everyday comfort. We focus on quality craftsmanship and modern essentials designed for real life. From fabric selection to finishing details, every piece is designed to balance structure, softness, and durability.",
      },
      {
        type: "images",
        src: "/Assets/Images/HQImages/VastraDrobeHQ.jpg",
      },
      {
        type: "heading",
        value: "Our Headquarters",
      },
      {
        type: "paragraph",
        value:
          "Our operations and quality control are managed from our headquarters in Gurugram, ensuring consistent craftsmanship and reliable service.",
      },
      {
        type: "heading",
        value: "Order Confirmation",
      },
      {
        type: "paragraph",
        value:
          "After placing an order, you will receive a confirmation email and SMS with your order details. If you do not receive confirmation within 10 minutes, please check your spam folder or contact support.",
      },
      {
        type: "heading",
        value: "Payment Methods",
      },
      {
        type: "list",
        items: [
          "UPI & Net Banking",
          "Credit & Debit Cards",
          "Cash on Delivery (select locations)",
        ],
      },
      {
        type: "heading",
        value: "Product Care",
      },
      {
        type: "paragraph",
        value:
          "To maintain fabric quality and longevity, follow the care instructions mentioned on the product label. Gentle washing and air drying are recommended for most garments.",
      },
      {
        type: "heading",
        value: "Customer Support",
      },
      {
        type: "paragraph",
        value:
          "For any queries regarding orders, sizing, returns, or general information, our support team is available via email and phone during business hours.",
      },
      {
        type: "heading",
        value: "Business Details",
      },
      {
        type: "list",
        items: [
          "Registered Business Name: VastraDrobe",
          "Headquarters: GF 43, Augusta Point, Golf Course Rd, Parsvnath Exotica, DLF Phase 5, Sector 53, Gurugram, Haryana, India",
          "Support Email: support@vastradrobe.com",
          "Business Hours: Monday – Saturday, 10 AM – 6 PM",
        ],
      },
    ],
  },
];
