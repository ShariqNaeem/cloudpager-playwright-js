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

test('Create a workpod but dont save it, just discard at the end.', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await page.waitForTimeout(10000)
    await dashboardPage.workpodSideNav.click()
    await page.waitForTimeout(10000)
    await workpodPage.draftsSection.click()
    await page.waitForTimeout(10000)
    await workpodPage.actionButton.click()
    await workpodPage.editOption.click()
    await workpodPage.editingAlert.isVisible()

    await workpodPage.setNameAndDescription(workpodData.updatedName, workpodData.updatedDescription)
    await workpodPage.addButtonInDraft.click({ force: true });
    await page.waitForTimeout(10000)
    await workpodPage.clickOnCheckBox(3)
    await workpodPage.clickOnCheckBox(4)
    await workpodPage.saveButton.click()

    await page.waitForTimeout(10000)
    await workpodPage.groupAndUsers.click()
    await workpodPage.addButtonInDraft.click({ force: true })
    await page.waitForTimeout(10000)
    await workpodPage.clickOnCheckBox(3)
    await workpodPage.clickOnCheckBox(4)

    await workpodPage.userTab.click()
    await page.waitForTimeout(10000)
    await workpodPage.clickOnCheckBox(3)
    await workpodPage.clickOnCheckBox(4)
    await workpodPage.saveButton.click()
})

test('Go to Drafts section and delete any existing Draft.', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page) 

    await page.waitForTimeout(10000)
    await dashboardPage.workpodSideNav.click()
    await page.waitForTimeout(10000)
    await workpodPage.draftsSection.click()
    await page.waitForTimeout(10000)
    await workpodPage.deleteFirstWorkpod();

})

test('Go to Published Workpod section and Edit any published workpod and then Saved it as a draft', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await page.waitForTimeout(10000)
    await dashboardPage.workpodSideNav.click()
    await page.waitForTimeout(10000)
    await workpodPage.publishedSection.click()
    await page.waitForTimeout(10000)
    await workpodPage.actionButton.click()
    await workpodPage.editOption.click()
    await workpodPage.editingAlert.isVisible()

    await workpodPage.setNameAndDescription(workpodData.updatedName, workpodData.updatedDescription)
    await workpodPage.addButtonInDraft.click({ force: true });
    await page.waitForTimeout(10000)
    await workpodPage.clickOnCheckBox(3)
    await workpodPage.clickOnCheckBox(4)
    await workpodPage.saveButton.click()

    await page.waitForTimeout(10000)
    await workpodPage.groupAndUsers.click()
    await workpodPage.addButtonInDraft.click({ force: true })
    await page.waitForTimeout(10000)
    await workpodPage.clickOnCheckBox(3)
    await workpodPage.clickOnCheckBox(4)

    await workpodPage.userTab.click()
    await page.waitForTimeout(10000)
    await workpodPage.clickOnCheckBox(3)
    await workpodPage.clickOnCheckBox(4)
    await workpodPage.saveButton.click()
    await workpodPage.saveDraftButton.click()
})