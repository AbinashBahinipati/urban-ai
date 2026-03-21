const puppeteer = require('puppeteer');

(async () => {
    console.log("Starting Puppeteer Diagnostics for Heatmap...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Capture and print browser console logs
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
    
    // Set viewport to full HD
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Go to map directly via injecting token
    await page.goto('http://localhost:5000/', { waitUntil: 'networkidle2' });
    
    console.log("Injecting token to bypass login...");
    await page.evaluate(() => {
        localStorage.setItem('urbancool_token', 'dummy_token_bypass');
    });
    
    // Reload to hit the auto-redirect logic if any, or just click login
    await page.reload({ waitUntil: 'networkidle2' });
    
    // Wait for map container
    try {
        console.log("Waiting for map phase...");
        // Fast-forward phase in React state? We can't easily, so let's log in
        await page.type('input[placeholder="Email"]', 'admin@urbancool.ai');
        await page.type('input[placeholder="Password"]', 'admin123');
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const loginBtn = btns.find(b => b.textContent === 'Login');
            if(loginBtn) loginBtn.click();
        });
        
        // Wait for zoom phase then map phase
        await page.waitForSelector('.map-mount', { timeout: 15000 });
        console.log("Map mounted. Waiting 3 secs for map tiles and rings to load...");
        await new Promise(r => setTimeout(r, 3000));
        
        await page.screenshot({ path: 'pulsing_heatmap_result.png' });
        console.log("Screenshot saved.");
    } catch(err) {
        console.error("Test failed:", err);
    }
    
    await browser.close();
})();
