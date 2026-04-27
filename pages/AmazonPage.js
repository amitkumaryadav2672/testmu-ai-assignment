const { expect } = require('@playwright/test');

class AmazonPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.url = 'https://www.amazon.com';
        
        // Selectors
        this.searchInput = 'id=twotabsearchtextbox';
        this.searchButton = 'id=nav-search-submit-button';
        this.firstProductLink = '.s-main-slot h2'; // Target the heading directly
        this.priceWhole = '.a-price-whole';
        this.priceFraction = '.a-price-fraction';
        this.addToCartButton = '#add-to-cart-button';
        this.cartCount = '#nav-cart-count';
        this.dismissLocation = 'input[data-action-type="SELECT_LOCATION_NONE_BTN"]'; // Selector for location popup "Dismiss"
    }

    async navigate() {
        await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
        
        // Handle potential location popup
        try {
            const dismiss = this.page.locator(this.dismissLocation);
            if (await dismiss.isVisible()) {
                await dismiss.click();
            }
        } catch (e) {}

        await this.page.waitForSelector(this.searchInput, { timeout: 30000 });
    }

    async searchFor(product) {
        await this.page.fill(this.searchInput, product);
        await this.page.click(this.searchButton);
        await this.page.waitForSelector(this.firstProductLink);
    }

    async selectFirstProduct() {
        await this.page.click(this.firstProductLink);
        await this.page.waitForSelector(this.priceWhole);
    }

    async getProductPrice() {
        const whole = await this.page.locator(this.priceWhole).first().innerText();
        const fraction = await this.page.locator(this.priceFraction).first().innerText();
        // Clean up any extra characters (like newlines) and format properly
        const cleanWhole = whole.replace(/\D/g, ''); // Keep only digits
        const cleanFraction = fraction.replace(/\D/g, ''); 
        return `${cleanWhole}.${cleanFraction}`;
    }

    async addToCart() {
        // Try multiple selectors for Add to Cart button
        const selectors = [
            '#add-to-cart-button',
            'input[name="submit.add-to-cart"]',
            '#add-to-cart-button-ubb',
            '#newAccordionRow i.a-icon-radio-active' // For items with multiple buying options
        ];

        let clicked = false;
        for (const selector of selectors) {
            try {
                const btn = this.page.locator(selector).first();
                if (await btn.isVisible({ timeout: 2000 })) {
                    await btn.click();
                    clicked = true;
                    break;
                }
            } catch (e) {}
        }

        if (!clicked) {
            // If no standard button found, try "See all buying options"
            try {
                const seeAll = this.page.locator('a:has-text("See All Buying Options")');
                if (await seeAll.isVisible()) {
                    await seeAll.click();
                    await this.page.waitForSelector('.a-button-stack input[name="submit.addToCart"]', { timeout: 5000 });
                    await this.page.click('.a-button-stack input[name="submit.addToCart"]');
                    clicked = true;
                }
            } catch (e) {}
        }
        
        // Handle side panel or "protection plan" popups
        const closeBtn = this.page.locator('#attach-close_sideSheet-link, #attach-sidesheet-checkout-button');
        try {
            await closeBtn.waitFor({ state: 'visible', timeout: 5000 });
            if (await this.page.locator('#attach-close_sideSheet-link').isVisible()) {
                await this.page.click('#attach-close_sideSheet-link');
            }
        } catch (e) {}
    }

    async getCartCount() {
        return await this.page.innerText(this.cartCount);
    }
}

module.exports = { AmazonPage };
