const { expect } = require('@playwright/test');

class AmazonPage {
    constructor(page) {
        this.page = page;
        // The link is the parent of the h2 in this layout
        this.productLinkSelector = 'a:has(h2), .s-result-item h2 a, h2 a';
    }

    async navigate() {
        await this.page.goto('https://www.amazon.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    }

    async searchFor(term) {
        const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(term)}`;
        await this.page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        // Wait for any result link to appear
        await this.page.waitForSelector('a:has(h2), h2', { timeout: 15000 });
        await this.page.waitForTimeout(2000);
    }

    async selectFirstProduct() {
        const firstResult = this.page.locator(this.productLinkSelector).first();
        await firstResult.waitFor({ state: 'visible', timeout: 15000 });
        
        const href = await firstResult.getAttribute('href');
        if (href) {
            const fullUrl = href.startsWith('http') ? href : `https://www.amazon.com${href}`;
            await this.page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        } else {
            await firstResult.click({ force: true });
        }
        
        await this.page.waitForSelector('#productTitle', { timeout: 15000 });
    }

    async getProductPrice() {
        const priceSelectors = [
            '.a-price .a-offscreen',
            '#corePriceDisplay_desktop_feature_div .a-offscreen',
            '#priceblock_ourprice',
            '.a-price-whole'
        ];
        
        for (const selector of priceSelectors) {
            try {
                const element = this.page.locator(selector).first();
                if (await element.isVisible({ timeout: 3000 })) {
                    const text = await element.textContent();
                    if (text && text.trim().length > 0) return text.trim();
                }
            } catch (e) {}
        }
        return "Price not found";
    }

    async addToCart() {
        const addToCartBtn = this.page.locator('#add-to-cart-button, input[name="submit.add-to-cart"], #add-to-cart-button-ubb').first();
        await addToCartBtn.click({ force: true });

        // Handle common popups
        try {
            const dismiss = this.page.locator('text=No Thanks, button:has-text("No thanks"), #attach-close_sideSheet-link').first();
            if (await dismiss.isVisible({ timeout: 5000 })) {
                await dismiss.click();
            }
        } catch (e) {}
    }

    async getCartCount() {
        try {
            const count = await this.page.locator('#nav-cart-count').textContent();
            return count ? count.trim() : "0";
        } catch (e) {
            return "0";
        }
    }
}

module.exports = { AmazonPage };
