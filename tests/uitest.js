import { chromium } from "playwright";
import path from "path";

const BASE = process.env.BASE_URL || "http://localhost:5173";
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    // Admin login
    await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
    await page.fill('input[placeholder="admin"]', "admin");
    await page.fill('input[placeholder="••••••••"]', "EMDAD2025");
    await page.click('button:has-text("Sign In to Admin")');
    await page.waitForSelector('button:has-text("Save Changes")', {
      timeout: 10000,
    });

    // Upload a document to the currently selected project
    await page.click('button:has-text("+ Upload Document")');
    const filePath = path.join(
      process.cwd(),
      "public",
      "images",
      "master-bedrooms",
      "BED1.jpg",
    );
    // set the file input
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.click("input[type=file]"),
    ]);
    await fileChooser.setFiles(filePath);

    // Click "Add Document →"
    await page.click('button:has-text("Add Document")');

    // Save changes
    await page.click('button:has-text("Save Changes")');

    // Wait for toast success
    await page.waitForSelector("text=Changes saved successfully.", {
      timeout: 10000,
    });

    // Open portal and login as client
    await page.goto(`${BASE}/portal`, { waitUntil: "networkidle" });
    // Choose Client Portal role
    await page.click('button:has-text("Client Portal")');
    await page.waitForSelector('input[placeholder*="0799-000-001"]', {
      timeout: 10000,
    });
    await page.fill('input[placeholder*="0799-000-001"]', "0799-000-001");
    await page.fill('input[placeholder*="pin"]', "1234").catch(async () => {
      // fallback: find password inputs
      await page.fill("input[type=password]", "1234");
    });
    await page.click('button:has-text("Login")').catch(async () => {
      // fallback to generic submit
      await page.click('button:has-text("Sign In")').catch(() => {});
    });

    // Wait for dashboard and the uploaded doc name
    await page.waitForSelector("text=BED1.jpg", { timeout: 10000 });

    console.log("UI test: PASS");
  } catch (err) {
    console.error("UI test: FAIL", err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
