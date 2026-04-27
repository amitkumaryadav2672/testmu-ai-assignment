const { test, expect } = require('@playwright/test');
const { AmazonPage } = require('../pages/AmazonPage');
const products = require('../test-data/products.json');
const logger = require('../utils/logger');

test.describe('Amazon Purchase Flow - Galaxy', () => {
    test('Navigate to Amazon, search for Galaxy device and add to cart', async ({ page }) => {
        const amazon = new AmazonPage(page);
        const data = products.galaxy;

        logger.test(data.testName, 'Navigating to Amazon...');
        await amazon.navigate();

        logger.test(data.testName, `Searching for: ${data.searchTerm}`);
        await amazon.searchFor(data.searchTerm);

        logger.test(data.testName, 'Selecting first product...');
        await amazon.selectFirstProduct();

        const price = await amazon.getProductPrice();
        logger.test(data.testName, `Device Price: ${price}`);
        console.log(`\n>>> PRICE FOR ${data.searchTerm.toUpperCase()}: ${price} <<<\n`);

        logger.test(data.testName, 'Adding to cart...');
        await amazon.addToCart();

        await page.waitForTimeout(3000); // Wait for cart update
        const cartCount = await amazon.getCartCount();
        logger.test(data.testName, `Items in cart: ${cartCount}`);

        expect(parseInt(cartCount)).toBeGreaterThan(0);
    });
});
