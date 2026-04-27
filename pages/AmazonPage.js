const { expect } = require('@playwright/test');
const logger = require('../utils/logger');

class AmazonPage {
    constructor(page) {
        this.page = page;
        this.searchInput = '#twotabsearchtextbox';
        this.searchButton = '#nav-search-submit-button';
    }

    async navigate() {
        await this.page.goto('https://www.amazon.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
        try {
            const dismiss = this.page.locator('input[data-action-type="SELECT_LOCATION"]');
            if (await dismiss.isVisible({ timeout: 2000 })) await dismiss.click();
        } catch (e) {}
    }

    async searchFor(term) {
        await this.page.waitForSelector(this.searchInput, { timeout: 10000 });
        await this.page.fill(this.searchInput, term);
        await this.page.click(this.searchButton);
        await this.page.waitForSelector('.s-main-slot', { timeout: 15000 });
    }

    async selectFirstProduct() {
        // Broad selector to find the first actual product link
        const firstProduct = this.page.locator('[data-component-type="s-search-result"] h2 a, .s-result-item h2 a, a:has(h2)').first();
        
        await firstProduct.waitFor({ state: 'visible', timeout: 15000 });
        await firstProduct.scrollIntoViewIfNeeded();
        
        const href = await firstProduct.getAttribute('href');
        if (href) {
            const fullUrl = href.startsWith('http') ? href : `https://www.amazon.com${href}`;
            await this.page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        } else {
            await firstProduct.click();
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
        // Path 1: Direct Add to Cart
        const directSelectors = ['#add-to-cart-button', 'input[name="submit.add-to-cart"]', '#add-to-cart-button-ubb'];
        for (const selector of directSelectors) {
            const button = this.page.locator(selector).first();
            if (await button.isVisible({ timeout: 2000 })) {
                await button.click();
                await this.handlePopups();
                return;
            }
        }

        // Path 2: See All Buying Options
        const buyingOptionsBtn = this.page.locator('#buybox-see-all-buying-options-announce, a:has-text("See All Buying Options")').first();
        if (await buyingOptionsBtn.isVisible({ timeout: 3000 })) {
            await buyingOptionsBtn.click();
            const offerAddToCart = this.page.locator('input[name="submit.addToCart"]').first();
            await offerAddToCart.waitFor({ state: 'visible', timeout: 5000 });
            await offerAddToCart.click();
            await this.handlePopups();
            return;
        }

        throw new Error('Add to Cart button or Buying Options not found');
    }

    async handlePopups() {
        try {
            const dismiss = this.page.locator('text=No Thanks, button:has-text("No thanks"), #attach-close_sideSheet-link, .a-button-close').first();
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
