const { test, expect, request } = require('@playwright/test')
const { LoginPage } = require('../page-object/login-page')
const { DashboardPage } = require('../page-object/dashboard-page')
const { WorkpodPage } = require('../page-object/workpod-page')

import credentials from '../test_data/credentials.json'
import workpodData from '../test_data/workpod.json'

test.describe.configure({ mode: 'serial' });
let page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page)

    await loginPage.openURL(credentials.login.url)
    await loginPage.signInMicrosoft.click()
    await loginPage.enterEmail(credentials.login.email)
    await loginPage.enterPassword(credentials.login.password)
    await loginPage.submitButton.click()
    await page.title('Cloudpager')
});

test.afterAll(async () => {
    await page.close();
});

test('Validate that user is able to create the workpod and publish it', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor();
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription(workpodData.name, workpodData.description)
    await workpodPage.addApplicationButton.click()

    await workpodPage.clickOnCheckBoxByText('GSD_AppV_AdobeAcrobatReaderDC_1')
    await workpodPage.clickOnCheckBoxByText('Notepad++')
    await workpodPage.saveButton.click()

    await workpodPage.addUserGroupButton.click()
  
    await workpodPage.clickOnCheckBoxByText('1NGroupTest_1')
    await workpodPage.clickOnCheckBoxByText('1NGroupTest_2')

    await workpodPage.userTab.click()
    
    await workpodPage.scrollInToModal('UAT1')
    await workpodPage.clickOnCheckBoxByText('UAT1')
    await workpodPage.clickOnCheckBoxByText('UAT2')
    await workpodPage.saveButton.click()
    await workpodPage.publishButton.click();

    await workpodPage.enterPublishComment('Automated comment...')
    await expect.soft(workpodPage.alertDialog).toContainText('New workpod published')
    await expect.soft(workpodPage.successMessgae).toContainText('Workpod Created')
})