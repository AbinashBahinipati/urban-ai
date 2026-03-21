const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

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
    
    console.log("Waiting for map and UI...");
    await page.waitForSelector('.pulse-ring', { timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));
    
    console.log("Clicking high-severity hotspot to trigger Alert Toast...");
    await page.evaluate(() => {
        const rings = document.querySelectorAll('.pulse-ring');
        if (rings.length > 0) {
           rings[0].click(); 
        }
    });

    await new Promise(r => setTimeout(r, 800));

    console.log("Toggling Day/Light Theme...");
    await page.evaluate(() => {
       const toggleBtn = document.querySelector('.theme-toggle-hud');
       if (toggleBtn) toggleBtn.click();
    });

    await new Promise(r => setTimeout(r, 1000));
    
    const shotPath = 'light_theme_alert.png';
    await page.screenshot({ path: shotPath });
    console.log("Light Theme + Alert Toast verification screenshot saved to " + shotPath);
    
  } catch (error) {
    console.error("Puppeteer Verification Error:", error);
  } finally {
    await browser.close();
  }
})();
