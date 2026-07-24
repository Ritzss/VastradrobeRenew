import { Order } from "@/Types/Order";
import { invoiceTemplate } from "./template";
import { ITransaction } from "@/model/Transaction";

export async function generateInvoice(
  order: Order,
  transaction: ITransaction | null,
): Promise<Buffer> {
  let browser;

  // 1. Detect if we are running in Serverless (Vercel) or Local Dev environment
  const isServerless =
    process.env.NODE_ENV === "production" || !!process.env.VERCEL;

  if (isServerless) {
    // Production (Vercel): Use serverless-optimized headless Chromium
    try {
      const puppeteerCore = await import("puppeteer-core");
      const chromium = (await import("@sparticuz/chromium")).default;

      browser = await puppeteerCore.launch({
        args: [
          ...chromium.args,
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless === "shell" ? true : chromium.headless,
      });
    } catch (err) {
      console.error(
        "Failed to launch Serverless Puppeteer core, falling back to standard launcher:",
        err,
      );
      // Fallback in case of serverless module resolution issues
      const puppeteer = await import("puppeteer");
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }
  } else {
    // Local Dev: Fall back to standard local puppeteer instance
    const puppeteer = await import("puppeteer");
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });
  }

  try {
    const page = await browser.newPage();

    // Render the beautiful HTML invoice template
    await page.setContent(invoiceTemplate(order, transaction), {
      waitUntil: "load",
    });

    // Wait for external fonts/images to load safely
    await page.waitForNetworkIdle();

    await page.emulateMediaType("screen");

    // Print to high-quality A4 PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    return Buffer.from(pdf);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
