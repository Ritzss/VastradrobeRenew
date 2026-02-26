export {};

declare global {
  interface RazorpayInstance {
    open: () => void;
  }

  interface Window {
    Razorpay: new (options: any) => RazorpayInstance;
  }
}