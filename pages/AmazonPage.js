const { expect } = require('@playwright/test');

class AmazonPage {
    constructor(page) {
        this.page = page;
        this.productLinkSelector = 'h2 a.a-link-normal, .s-main-slot .s-result-item h2 a';
    }

    async navigate() {
        await this.page.goto('https://www.amazon.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    }

    async searchFor(term) {
        // Direct navigation to search results is more stable than interacting with the search bar
        const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(term)}`;
        await this.page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await this.page.waitForSelector('.s-main-slot', { timeout: 15000 });
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
            '#corePriceDisplay_desktop_feature_div .a-offscreen',
            '.a-price .a-offscreen',
            '#priceblock_ourprice',
            'span.a-price-whole'
        ];
        
        for (const selector of priceSelectors) {
            try {
                const element = this.page.locator(selector).first();
                if (await element.isVisible({ timeout: 3000 })) {
                    return await element.textContent();
                }
            } catch (e) {}
        }
        return "Price not found";
    }

    async addToCart() {
        const addToCartBtn = this.page.locator('#add-to-cart-button, input[name="submit.add-to-cart"]').first();
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
            return await this.page.locator('#nav-cart-count').textContent();
        } catch (e) {
            return "0";
        }
    }
}

module.exports = { AmazonPage };
