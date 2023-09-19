const {chromium , expect} = require('@playwright/test');
import credentials from '../test_data/credentials.json';

module.exports = async config => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    let email = credentials.login.email;
    let password = credentials.login.password;
    await page.goto(credentials.login.url);
    await page.waitForLoadState('networkidle');
    await page.locator('span.mat-button-wrapper').click();
    await page.locator('input[type="email"]').type(email)
    await page.locator('input[type="submit"]').click();
    await page.locator('input[name="passwd"]').type(password);
    await page.locator('input[type="submit"]').click();
    await page.locator('input[type="submit"]').click();
    await page.waitForTimeout(5000);
    await page.title('Cloudpager');

    await page.context().storageState({path: 'storageState.json'});
    await browser.close();
}