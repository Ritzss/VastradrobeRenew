/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  interface Window {
    initSendOTP: (config: {
      widgetId: string;
      tokenAuth: string;
      exposeMethods?: boolean;
      success?: (data: any) => void;
      failure?: (error: any) => void;
    }) => void;

    sendOtp: (
      identifier: string,
      success?: (data: any) => void,
      failure?: (error: any) => void
    ) => void;

    verifyOtp: (
      otp: string,
      success?: (data: any) => void,
      failure?: (error: any) => void,
      reqId?: string
    ) => void;

    retryOtp: (
      channel: string | null,
      success?: (data: any) => void,
      failure?: (error: any) => void,
      reqId?: string
    ) => void;

    getWidgetData: () => any;

    isCaptchaVerified: () => boolean;
  }
}