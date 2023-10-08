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
    await workpodPage.setNameAndDescription(workpodData.sampleWorkpod.name, workpodData.sampleWorkpod.description)
    await workpodPage.addApplicationButton.click()

    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.applications[5])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.applications[6])
    await workpodPage.saveButton.click()

    await workpodPage.addUserGroupButton.click()
  
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.groups[0])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.groups[1])

    await workpodPage.userTab.click()
    
    await workpodPage.searchInModal.waitFor()
    await workpodPage.searchInModal.fill(workpodData.sampleWorkpod.users[4])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.users[4])
    await workpodPage.searchInModal.fill(workpodData.sampleWorkpod.users[5])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.users[5])

    await workpodPage.saveButton.click()
    await workpodPage.publishButton.click();

    await workpodPage.enterPublishComment(workpodData.sampleWorkpod.comment)
    await expect.soft(workpodPage.alertDialog).toContainText(workpodData.validationMessages.newPublishAlertMessage)
    await expect.soft(workpodPage.successMessgae).toContainText(workpodData.validationMessages.workpodCreatedMessage)
})