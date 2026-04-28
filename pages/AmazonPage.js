const { expect } = require('@playwright/test');
const logger = require('../utils/logger');

class AmazonPage {
    constructor(page) {
        this.page = page;
    }

    async navigate() {
        logger.info('Navigating to Amazon...');
        await this.page.goto('https://www.amazon.com', { waitUntil: 'domcontentloaded' });
        
        // Clear initial popups
        await this.clearPopups();

        // Try to set Location
        try {
            let loc = '';
            try {
                await this.page.waitForSelector('#glow-ingress-line2', { timeout: 5000 });
                loc = await this.page.locator('#glow-ingress-line2').textContent();
            } catch (e) {
                logger.info('Could not find location text, assuming update is needed.');
            }
            
            if (!loc || !loc.includes('10001')) {
                logger.info('Updating location to New York (10001)...');
                
                // Aggressively click until the modal opens (Super Fast)
                for (let attempt = 1; attempt <= 5; attempt++) {
                    const zipInput = this.page.locator('#GLUXZipUpdateInput');
                    if (await zipInput.isVisible()) break;
                    
                    // If the "Change Address" tooltip is open, click it directly
                    const tooltipBtn = this.page.locator('text="Change Address", input[data-action-type="SELECT_LOCATION"]').first();
                    if (await tooltipBtn.isVisible({ timeout: 500 })) {
                        await tooltipBtn.click({ force: true, timeout: 1000 }).catch(() => {});
                    } else {
                        const locBtn = this.page.locator('#nav-global-location-popover-link, #nav-global-location-slot, #glow-ingress-block').first();
                        await locBtn.click({ force: true, timeout: 2000 }).catch(() => {});
                    }
                    
                    try {
                        await zipInput.waitFor({ state: 'visible', timeout: 1500 });
                        break; // Success
                    } catch (e) {
                        // Modal didn't open yet, loop will click again immediately
                    }
                }
                
                const zipInput = this.page.locator('#GLUXZipUpdateInput');
                await zipInput.waitFor({ state: 'visible', timeout: 5000 });
                        
                        await zipInput.fill('10001');
                        await zipInput.press('Enter');
                        await this.page.waitForTimeout(1000);
                        
                        const doneBtn = this.page.locator('.a-popover-footer button, [name="glowDoneButton"], button:has-text("Continue")');
                        if (await doneBtn.first().isVisible({ timeout: 3000 })) {
                            await doneBtn.first().click({ force: true });
                        }
                        
                logger.info('Location updated in modal successfully.');
                
                // Reload the page to ensure the location takes effect globally
                await this.page.reload({ waitUntil: 'domcontentloaded' });
            }
            logger.info('Location setup complete.');
        } catch (e) {
            logger.info('Location setup warning: ' + e.message.split('\\n')[0]);
        }
        await this.clearPopups();
    }

    async clearPopups() {
        // Close specific 'You are now shopping for delivery to...' modals
        try {
            const continueBtn = this.page.locator('button:has-text("Continue"), input[value="Continue"], .a-popover-footer input').first();
            if (await continueBtn.isVisible({ timeout: 1000 })) {
                await continueBtn.click({ force: true });
            }
        } catch(e) {}
        
        // Evaluate JavaScript to aggressively remove modals that block the UI
        try {
            await this.page.evaluate(() => {
                const modals = document.querySelectorAll('.a-popover-modal, .a-popover-background, #nav-main .nav-progressive-content');
                modals.forEach(m => {
                    if (m && m.style) m.style.display = 'none';
                });
                const closeBtns = document.querySelectorAll('[data-action-type="DISMISS"], .a-button-close, input[data-action-type="SELECT_LOCATION"]');
                closeBtns.forEach(btn => btn.click());
            });
        } catch (e) {
            // Ignore execution context errors during navigation
        }
        await this.page.waitForTimeout(500);
    }

    async searchFor(term) {
        await this.clearPopups();

        logger.info(`Searching: ${term}`);
        const searchBox = this.page.locator('#twotabsearchtextbox');
        await searchBox.waitFor({ state: 'visible' });
        await searchBox.fill(term);
        
        // Native press Enter to trigger Amazon's React/JS event handlers
        await searchBox.press('Enter');
        
        // Wait a moment for navigation to begin
        await this.page.waitForTimeout(2000);
        
        try {
            await Promise.race([
                this.page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 15000 }),
                this.page.waitForSelector('.s-main-slot', { timeout: 15000 }),
                this.page.waitForSelector('#productTitle', { timeout: 15000 })
            ]);
        } catch (e) {
            throw new Error('Search results did not load in time.');
        }
    }

    async selectValidProduct() {
        logger.info('Selecting shippable product...');

        if (await this.page.locator('#productTitle').isVisible()) {
            logger.info('Amazon navigated directly to a product page.');
            return;
        }

        const products = this.page.locator('[data-component-type="s-search-result"]:not(.adholder) a:has(h2), [data-component-type="s-search-result"]:not(.adholder) h2 a, .s-result-item a:has(h2)');
        try {
            await products.first().waitFor({ state: 'visible', timeout: 15000 });
        } catch (e) {
            throw new Error('No search results found to select from.');
        }
        
        const count = await products.count();
        // Check up to 15 products to find one that has purchase buttons
        for (let i = 0; i < Math.min(count, 15); i++) {
            const product = products.nth(i);
            
            // Use force:true to click through any remaining invisible layers
            await product.click({ force: true });
            
            try {
                await this.page.waitForSelector('#productTitle', { timeout: 10000 });
                
                // Check if any purchase button exists instead of looking for region-blocked text
                const directBtn = this.page.locator('input#add-to-cart-button, input[name="submit.add-to-cart"]').first();
                const buyingBtn = this.page.locator('#buybox-see-all-buying-options-announce, a[title="See All Buying Options"]').first();
                
                const hasDirect = await directBtn.isVisible({ timeout: 2000 }).catch(() => false);
                const hasBuying = await buyingBtn.isVisible({ timeout: 2000 }).catch(() => false);
                
                if (!hasDirect && !hasBuying) {
                    logger.info('Region-blocked or no purchase button. Trying next...');
                    await this.page.goBack();
                    await this.page.waitForSelector('.s-main-slot');
                    continue;
                }

                logger.info('Valid product selected.');
                return;
            } catch (e) {
                logger.info('Navigation failed or timeout. Trying next...');
                await this.page.goBack();
                await this.page.waitForSelector('.s-main-slot');
                continue; 
            }
        }
        throw new Error('No valid products found.');
    }

    async getProductPrice() {
        const selectors = ['.a-price .a-offscreen', '#price_inside_buybox', '#corePriceDisplay_desktop_feature_div .a-offscreen'];
        for (const s of selectors) {
            const price = this.page.locator(s).filter({ visible: true }).first();
            if (await price.isVisible()) return (await price.textContent()).trim();
        }
        return "Price on page";
    }

    async addToCart() {
        logger.info('Adding to cart...');
        await this.clearPopups();

        const directBtn = this.page.locator('input#add-to-cart-button, input[name="submit.add-to-cart"]').filter({ visible: true }).first();
        if (await directBtn.isVisible({ timeout: 4000 })) {
            await directBtn.click({ force: true });
            await this.handlePopups();
            return;
        }

        const buyingBtn = this.page.locator('#buybox-see-all-buying-options-announce, a[title="See All Buying Options"]').filter({ visible: true }).first();
        if (await buyingBtn.isVisible({ timeout: 4000 })) {
            await buyingBtn.click({ force: true });
            await this.page.waitForTimeout(3000);
            const offerBtn = this.page.locator('input[name="submit.addToCart"], input[name="submit.add-to-cart"]').filter({ visible: true }).first();
            await offerBtn.click({ force: true });
            await this.handlePopups();
            return;
        }

        throw new Error('Add to Cart button missing.');
    }

    async handlePopups() {
        // Specifically look for the Extra Protection / Warranty modal
        try {
            // isVisible() checks instantly, so we must use waitFor() to give the modal time to animate in
            const noThanksBtn = this.page.locator('#attachSiNoCoverage-announce, #attachSiNoCoverage, text="No thanks", text="No Thanks", input[aria-labelledby="attachSiNoCoverage-announce"]').first();
            await noThanksBtn.waitFor({ state: 'visible', timeout: 4000 });
            logger.info('Extra protection modal detected! Clicking No Thanks...');
            await noThanksBtn.click({ force: true });
            await this.page.waitForTimeout(1500); // Give it time to close and update cart
        } catch (e) {
            // Modal did not appear, safely ignore
        }

        await this.clearPopups();
    }

    async verifyAddedToCart() {
        await expect(this.page.locator('body')).toContainText(/Added to Cart|Proceed to checkout|Cart subtotal/i, { timeout: 15000 });
        logger.info('SUCCESS!');
    }
}

module.exports = { AmazonPage };
