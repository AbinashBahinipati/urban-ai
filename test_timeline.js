const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    console.log("Navigating to http://localhost:5000");
    await page.goto("http://localhost:5000");
    
    // Login to access dashboard
    console.log("Logging in as admin...");
    await page.waitForSelector('input[placeholder="Email"]');
    await page.type('input[placeholder="Email"]', 'admin@urbancool.ai');
    await page.type('input[placeholder="Password"]', 'admin123');
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const loginBtn = btns.find(b => b.textContent === 'Login');
        if(loginBtn) loginBtn.click();
    });
    
    // Wait for the map and HUD to appear
    console.log("Waiting for map and HUD to load...");
    await page.waitForSelector('.map-mount canvas', { timeout: 10000 });
    await page.waitForSelector('.timeline-hud', { timeout: 10000 });
    
    // Give time for initial animations
    await new Promise(r => setTimeout(r, 2000));
    
    // Click the future span
    console.log("Shifting timeline to 2040 Future...");
    await page.evaluate(() => {
      const spans = Array.from(document.querySelectorAll('.timeline-hud span'));
      const futureSpan = spans.find(s => s.textContent.includes('2040 FUTURE'));
      if (futureSpan) futureSpan.click();
    });
    
    // Wait for mapping gradient to transition
    await new Promise(r => setTimeout(r, 1500));
    
    // Save screenshot
    const shotPath = 'timeline_future.png';
    await page.screenshot({ path: shotPath });
    console.log("Timeline Future verification screenshot saved to " + shotPath);
    
  } catch (error) {
    console.error("Puppeteer Verification Error:", error);
  } finally {
    await browser.close();
  }
})();
