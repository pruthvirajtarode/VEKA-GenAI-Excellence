const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.toString()));
    
    const filePath = `file://${path.join(__dirname, 'index.html').replace(/\\/g, '/')}`;
    console.log('Navigating to', filePath);
    
    await page.goto(filePath, { waitUntil: 'networkidle0' });
    
    const display = await page.evaluate(() => {
        const overlay = document.getElementById('loading-overlay');
        const app = document.getElementById('app');
        return {
            overlay: overlay ? overlay.style.display : 'not found',
            overlayOpacity: overlay ? overlay.style.opacity : 'not found',
            app: app ? app.style.display : 'not found'
        };
    });
    
    console.log('Displays:', display);
    
    await browser.close();
})();
