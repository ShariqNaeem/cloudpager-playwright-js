const { test, expect, request } = require('@playwright/test');
import credentials from '../test_data/credentials.json'

test('Workpod functionality', async ({ page }) => {

    let email = credentials.login.email;
    let password = credentials.login.password;

    await page.goto("https://staging.cloudpager.net/admin/applications/all");
    await page.waitForLoadState('networkidle');

    await page.locator('span.mat-button-wrapper').click();
    await page.locator('input[type="email"]').type(email)
    await page.locator('input[type="submit"]').click();

    await page.locator('input[name="passwd"]').type(password);
    await page.locator('input[type="submit"]').click();
    await page.locator('input[type="submit"]').click();
    await page.waitForTimeout(5000);

    await page.title('Cloudpager');
    await page.locator('a[href="/admin/workpods"]').click();
    await page.waitForTimeout(5000);
    await page.locator('#btnUploadApp').click();
    await page.locator('#wb-name-input').click();
    await page.locator('#wb-name-input').type('Nisar Pod');
    await page.locator('#mat-input-1').click();
    await page.locator('#mat-input-1').type('Automation Testing');
    await page.locator('#add-app-btn > .mat-button-wrapper').click();

    await page.locator('#mat-checkbox-30 .mat-checkbox-inner-container').click();
    await page.locator('.mat-row:nth-child(3) > .cdk-column-select').click();
    await page.locator('#mat-checkbox-6 .mat-checkbox-inner-container').click();
    
    await page.locator('#mat-dialog-0').click();
    await page.locator('.btn-save').click();
    // await page.locator('#add-app-btn > .mat-button-wrapper').click();
    // await page.locator('#add-app-btn > .mat-button-wrapper').click();

})

