const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

app.post('/get-floorplan', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Please provide a Rightmove URL' });
    }

    const baseUrl = url.split('#')[0];
    const floorplanUrl = baseUrl + '#/floorplan';

    let browser;
    try {
        console.log(`[Scraper] 1/2: Fetching text data from: ${baseUrl}`);
        
        browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });

        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        const page = await context.newPage();
        
        await page.goto(baseUrl, { waitUntil: 'networkidle' });

        const extractText = async (selector) => {
            try {
                const text = await page.locator(selector).first().textContent({ timeout: 2000 });
                return text ? text.replace(/\s+/g, ' ').trim() : null;
            } catch (e) {
                return null; 
            }
        };

        const address = await extractText('[itemprop="streetAddress"]');
        const primaryPrice = await extractText('[data-testid="primaryPrice"] span');
        const secondaryPrice = await extractText('[data-testid="secondaryPrice"]');
        const description = await extractText('h2:has-text("Description") + div');

        let keyFeatures = [];
        try {
            // Find all list items inside the keyFeatures container
            const features = await page.locator('[data-testid="keyFeatures"] li').allTextContents();
            // Clean up any weird spacing in each feature
            keyFeatures = features.map(f => f.replace(/\s+/g, ' ').trim());
        } catch (e) {
            console.log("[Scraper] No key features found on this listing.");
        }

        console.log(`[Scraper] 2/2: Switching to floorplan view...`);

        await page.goto(floorplanUrl, { waitUntil: 'networkidle' });

        const imageSelector = 'img[alt*="floorplan" i]'; 
        let finalImageUrl = null;
        try {
            await page.waitForSelector(imageSelector, { timeout: 8000 });
            finalImageUrl = await page.locator(imageSelector).first().getAttribute('src');
        } catch (e) {
            console.log("[Scraper] No floorplan image found.");
        }

        console.log(`[Scraper] Success! Retrieved all data for: ${address || 'Unknown Address'}`);
        
        res.json({ 
            success: true, 
            data: {
                address,
                primaryPrice,
                secondaryPrice,
                keyFeatures,
                description,
                floorplanUrl: finalImageUrl
            }
        });

    } catch (error) {
        console.error("[Scraper] Error fetching listing:", error.message);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Playwright Scraper API running on port ${PORT}...`);
});
