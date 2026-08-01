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
          "Items can be returned within 3 days of delivery if unused and in original packaging.",
      },
      {
        type: "list",
        items: [
          "Product must be unused and unwashed",
          "Original tags must be intact",
          "Return request must be initiated within 3 days",
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
    title: "Terms & Conditions",
    slug: "terms-and-conditions",
    description:
      "The rules and guidelines for using VastraDrobe and placing orders.",
    content: [
      {
        type: "heading",
        value: "Acceptance of Terms",
      },
      {
        type: "paragraph",
        value:
          "By accessing and using the VastraDrobe website, you agree to comply with and be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our website.",
      },
      {
        type: "heading",
        value: "Eligibility",
      },
      {
        type: "paragraph",
        value:
          "By placing an order, you confirm that you are at least 18 years old or are using the website under the supervision of a parent or legal guardian.",
      },
      {
        type: "heading",
        value: "Product Information",
      },
      {
        type: "paragraph",
        value:
          "We strive to ensure that product descriptions, pricing, and availability are accurate. However, errors may occur. We reserve the right to correct any errors and cancel or refuse orders placed based on incorrect information.",
      },
      {
        type: "heading",
        value: "Pricing & Payments",
      },
      {
        type: "list",
        items: [
          "All prices are listed in INR unless stated otherwise.",
          "Prices may change without prior notice.",
          "Payments must be completed before order processing.",
          "We reserve the right to cancel suspicious or fraudulent transactions.",
        ],
      },
      {
        type: "heading",
        value: "Order Confirmation",
      },
      {
        type: "paragraph",
        value:
          "An order confirmation email does not guarantee acceptance of your order. We reserve the right to cancel or limit quantities at our discretion.",
      },
      {
        type: "heading",
        value: "Shipping & Delivery",
      },
      {
        type: "paragraph",
        value:
          "Delivery timelines are estimates and may vary due to unforeseen circumstances. VastraDrobe is not liable for delays caused by third-party logistics providers.",
      },
      {
        type: "heading",
        value: "Returns & Refunds",
      },
      {
        type: "paragraph",
        value:
          "Returns and refunds are governed by our Returns & Refund Policy. Please review that section for detailed information regarding eligibility and timelines.",
      },
      {
        type: "heading",
        value: "Intellectual Property",
      },
      {
        type: "paragraph",
        value:
          "All content on this website, including images, designs, text, and branding, is the property of VastraDrobe and may not be copied, reproduced, or used without prior written permission.",
      },
      {
        type: "heading",
        value: "Limitation of Liability",
      },
      {
        type: "paragraph",
        value:
          "VastraDrobe shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our website or products.",
      },
      {
        type: "heading",
        value: "User Conduct",
      },
      {
        type: "list",
        items: [
          "You agree not to misuse the website.",
          "You will not attempt to interfere with website security.",
          "You will not use the website for fraudulent or unlawful purposes.",
        ],
      },
      {
        type: "heading",
        value: "Termination",
      },
      {
        type: "paragraph",
        value:
          "We reserve the right to suspend or terminate user accounts that violate these Terms & Conditions.",
      },
      {
        type: "heading",
        value: "Governing Law",
      },
      {
        type: "paragraph",
        value:
          "These Terms & Conditions are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts located in Gurugram, Haryana.",
      },
      {
        type: "heading",
        value: "Contact Information",
      },
      {
        type: "paragraph",
        value:
          "For any questions regarding these Terms & Conditions, please contact us at support@vastradrobe.com.",
      },
    ],
  },
  {
    title: "Privacy Policy",
    slug: "privacy-and-policy",
    description:
      "How we collect, use, and protect your personal information at VastraDrobe.",
    content: [
      {
        type: "heading",
        value: "Information We Collect",
      },
      {
        type: "paragraph",
        value:
          "When you use VastraDrobe, we may collect personal information such as your name, email address, phone number, shipping address, and payment details. We also collect technical data like IP address, browser type, and device information to improve your shopping experience.",
      },
      {
        type: "heading",
        value: "How We Use Your Information",
      },
      {
        type: "list",
        items: [
          "To process and deliver your orders",
          "To send order confirmations and updates",
          "To improve our website and services",
          "To provide customer support",
          "To send promotional offers (only if you opt in)",
        ],
      },
      {
        type: "heading",
        value: "Payment Information",
      },
      {
        type: "paragraph",
        value:
          "We do not store your card or UPI details on our servers. All payments are processed securely through trusted third-party payment gateways.",
      },
      {
        type: "heading",
        value: "Cookies & Tracking",
      },
      {
        type: "paragraph",
        value:
          "We use cookies and similar technologies to enhance site functionality, analyze traffic, and personalize your shopping experience. You can disable cookies through your browser settings, though some features may not function properly.",
      },
      {
        type: "heading",
        value: "Data Security",
      },
      {
        type: "paragraph",
        value:
          "We implement appropriate security measures to protect your personal information from unauthorized access, misuse, or disclosure. However, no online transmission is completely secure, and we cannot guarantee absolute security.",
      },
      {
        type: "heading",
        value: "Sharing of Information",
      },
      {
        type: "paragraph",
        value:
          "We do not sell or rent your personal information. Your data may be shared with logistics partners, payment providers, and service providers only as necessary to fulfill your order and operate our services.",
      },
      {
        type: "heading",
        value: "Your Rights",
      },
      {
        type: "list",
        items: [
          "You may request access to your personal data",
          "You may request correction of inaccurate information",
          "You may request deletion of your account",
          "You may opt out of marketing communications at any time",
        ],
      },
      {
        type: "heading",
        value: "Policy Updates",
      },
      {
        type: "paragraph",
        value:
          "We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. Continued use of our website after updates constitutes acceptance of the revised policy.",
      },
      {
        type: "heading",
        value: "Contact Us",
      },
      {
        type: "paragraph",
        value:
          "If you have any questions regarding this Privacy Policy or how your data is handled, please contact us at support@vastradrobe.com.",
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
        src: "https://res.cloudinary.com/dwhn5ec09/image/upload/v1771933730/VastraDrobeHQ_nrxzqz.jpg",
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
