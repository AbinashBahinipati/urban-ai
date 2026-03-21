const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  
  try {
    await page.setViewport({ width: 1920, height: 1080 });
    console.log("Navigating to Vite React App: http://localhost:5173/");
    await page.goto("http://localhost:5173/", { waitUntil: 'networkidle0', timeout: 30000 });
    
    await wait(2000);
    
    const dashShot = 'vite_dashboard.png';
    await page.screenshot({ path: dashShot });
    console.log("Saved dashboard screenshot: " + dashShot);
    
    console.log("Clicking Map View...");
    await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const mapLink = links.find(l => l.textContent.includes('Map View'));
        if(mapLink) mapLink.click();
    });

    console.log("Waiting for Mapbox FlyTo cinematic animation...");
    await wait(5500);
    
    const mapShot = 'vite_mapview.png';
    await page.screenshot({ path: mapShot });
    console.log("Saved MapView screenshot: " + mapShot);
    
  } catch (error) {
    console.error("Puppeteer Verification Error:", error);
  } finally {
    await browser.close();
  }
})();
