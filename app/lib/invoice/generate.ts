import puppeteer from "puppeteer";
import { Order } from "@/Types/Order";
import { invoiceTemplate } from "./template";

export async function generateInvoice(order: Order): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,

    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    await page.setContent(invoiceTemplate(order), {
      waitUntil: "load",
    });

    await page.waitForNetworkIdle();

    await page.emulateMediaType("screen");

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
    await browser.close();
  }
}
