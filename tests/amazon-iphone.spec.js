const { test, expect } = require('@playwright/test');
const { AmazonPage } = require('../pages/AmazonPage');
const products = require('../test-data/products.json');
const logger = require('../utils/logger');

test.describe('Amazon Purchase Flow - iPhone', () => {
    test('Navigate to Amazon, search for iPhone and add to cart', async ({ page }) => {
        const amazon = new AmazonPage(page);
        const data = products.iphone;

        logger.test(data.testName, 'Navigating to Amazon...');
        await amazon.navigate();

        logger.test(data.testName, `Searching for: ${data.searchTerm}`);
        await amazon.searchFor(data.searchTerm);

        logger.test(data.testName, 'Selecting valid product...');
        await amazon.selectValidProduct();

        const price = await amazon.getProductPrice();
        logger.test(data.testName, `Device Price: ${price}`);
        console.log(`\n>>> PRICE FOR ${data.searchTerm.toUpperCase()}: ${price} <<<\n`);

        logger.test(data.testName, 'Adding to cart...');
        await amazon.addToCart();

        await amazon.verifyAddedToCart();
        
        logger.test(data.testName, 'Product successfully added to cart');

        // As requested: Keep the browser open indefinitely until manually closed
        await page.pause();
    });
});
