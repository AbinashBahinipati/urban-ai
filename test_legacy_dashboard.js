const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  
  try {
    await page.setViewport({ width: 1920, height: 1080 });
    console.log("Navigating to http://localhost:5000/");
    await page.goto("http://localhost:5000/", { waitUntil: 'networkidle0', timeout: 30000 });
    
    console.log("Executing login sequence bypassing earth scale...");
    // Simulate finding the login button or just triggering the state transition
    await page.evaluate(() => {
       const inputs = Array.from(document.querySelectorAll('input'));
       if(inputs.length >= 2) {
          inputs[0].value = "test@urbancool.ai";
          inputs[1].value = "password123";
          
          Object.defineProperty(inputs[0], 'value', { value: "test@urbancool.ai" });
          Object.defineProperty(inputs[1], 'value', { value: "password123" });
       }
       const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Login'));
       if(btn) btn.click();
    });
    
    // The login takes 3s to transition phase='zooming' -> 'map' plus api
    console.log("Waiting for map render...");
    await wait(8000);
    
    const dashShot = 'legacy_dashboard_mode_screenshot.png';
    await page.screenshot({ path: dashShot });
    console.log("Saved dashboard screenshot: " + dashShot);
    
    console.log("Clicking Map View button to test full screen transition...");
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('.view-nav-btn')).find(b => b.textContent === 'Map View');
        if(btn) btn.click();
    });

    // Wait for the 0.7s CSS transition + 0.8s resize timeout
    await wait(2500);
    
    const fullShot = 'legacy_full_map_screenshot.png';
    await page.screenshot({ path: fullShot });
    console.log("Saved full map screenshot: " + fullShot);
    
  } catch (error) {
    console.error("Puppeteer Verification Error:", error);
  } finally {
    await browser.close();
  }
})();
