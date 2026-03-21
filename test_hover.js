const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.setViewport({ width: 1920, height: 1080 });
    console.log("Navigating to http://localhost:5000");
    await page.goto("http://localhost:5000");
    
    console.log("Logging in as admin...");
    await page.waitForSelector('input[placeholder="Email"]');
    await page.type('input[placeholder="Email"]', 'admin@urbancool.ai');
    await page.type('input[placeholder="Password"]', 'admin123');
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const loginBtn = btns.find(b => b.textContent === 'Login');
        if(loginBtn) loginBtn.click();
    });
    
    console.log("Waiting for map and overlays...");
    await page.waitForSelector('.pulse-ring', { timeout: 15000 });
    
    // Give time for initial camera fly-in and GSAP logic
    await new Promise(r => setTimeout(r, 3000));
    
    console.log("Triggering hover interaction on first hotspot...");
    await page.evaluate(() => {
        const ring = document.querySelector('.pulse-ring');
        if (ring) {
            const rect = ring.getBoundingClientRect();
            const clientX = rect.x + (rect.width / 2);
            const clientY = rect.y + (rect.height / 2);
            
            const mouseEventEnter = new MouseEvent('mouseenter', {
                view: window, bubbles: true, cancelable: true, clientX, clientY
            });
            const mouseEventMove = new MouseEvent('mousemove', {
                view: window, bubbles: true, cancelable: true, clientX, clientY
            });
            ring.dispatchEvent(mouseEventEnter);
            ring.dispatchEvent(mouseEventMove);
            
            console.log("Dispatched hover events at", clientX, clientY);
        } else {
            console.log("No pulse ring found to hover over!");
        }
    });

    // Wait for the CSS transition (0.2s) + small buffer
    await new Promise(r => setTimeout(r, 1000));
    
    const shotPath = 'tooltip_hover.png';
    await page.screenshot({ path: shotPath });
    console.log("Tooltip verification screenshot saved to " + shotPath);
    
  } catch (error) {
    console.error("Puppeteer Verification Error:", error);
  } finally {
    await browser.close();
  }
})();
