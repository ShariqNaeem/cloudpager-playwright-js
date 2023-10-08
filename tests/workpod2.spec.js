const { test, expect, request } = require('@playwright/test')
const { LoginPage } = require('../page-object/login-page')
const { DashboardPage } = require('../page-object/dashboard-page')
const { WorkpodPage } = require('../page-object/workpod-page')

import credentials from '../test_data/credentials.json'
import workpodData from '../test_data/workpod.json'

test.describe.configure({ mode: 'serial' });
let page;
let flag;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page)

    await loginPage.openURL(credentials.login.url)
    await loginPage.signInMicrosoft.click()
    await loginPage.enterEmail(credentials.login.email)
    await loginPage.enterPassword(credentials.login.password)
    await loginPage.submitButton.click()
    await page.title('Cloudpager')
})

test.afterEach(async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    if (flag) {
        await dashboardPage.workpodSideNav.waitFor();
        await dashboardPage.workpodSideNav.click()
        await page.waitForLoadState('load')

        await workpodPage.firstWorkpodName.waitFor();
        await workpodPage.deleteFirstWorkpod();
        await workpodPage.verfiyAlertByText('Workpod deleted.')
    }
})

test.afterAll(async () => {
    await page.close();
})

for (const record of workpodData.inputValidationsWorkpods) {
    test(`${record.testName}`, async () => {
        const dashboardPage = new DashboardPage(page)
        const workpodPage = new WorkpodPage(page)
        flag = false;

        await dashboardPage.workpodSideNav.click()
        await page.waitForLoadState('domcontentloaded')
        await workpodPage.addWorkpod.click()
        await page.waitForSelector('#wb-name-input');

        await workpodPage.workpodDescription.fill(record.description);
        await workpodPage.workpodName.click();
        if (record.descriptionErrorMsg !== '') {
            await expect(workpodPage.roleAlert).toContainText(record.descriptionErrorMsg)
        }
        await workpodPage.workpodDescription.clear();
        await workpodPage.workpodName.fill(record.name);
        await expect(workpodPage.roleAlert).toContainText(record.nameErrorMsg)
    })
}

// We will cover this test case in the "createValidWorkpods".
test.skip('Add/Save a workpod with three spaces in name and description.', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)
    flag = true;

    await page.waitForLoadState('domcontentloaded')
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await workpodPage.workpodName.fill('   ', { delay: 100 });
    await workpodPage.workpodDescription.fill('   ', { delay: 100 });
    await workpodPage.saveDraftButton.click();

    await expect.soft(workpodPage.alertDialog.last()).toBeVisible()
    await expect.soft(workpodPage.successMessgae).toContainText('Workpod Created')
})

test('Under the Negative/Edge cases, be sure to test editing with 0 apps and 0 users/groups.', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)
    flag = true;

    await dashboardPage.workpodSideNav.click()
    await page.waitForLoadState('domcontentloaded')
    await workpodPage.addWorkpod.click()
    await page.waitForSelector('#wb-name-input')

    await workpodPage.setNameAndDescription(workpodData.name, workpodData.description)
    await workpodPage.saveDraftButton.click()
    await workpodPage.verfiyAlertByText('New draft created.')
    await expect.soft(workpodPage.successMessgae).toContainText('Workpod Created')

    await dashboardPage.workpodSideNav.waitFor();
    await dashboardPage.workpodSideNav.click()
    await workpodPage.draftsSection.click()
    await workpodPage.actionButton.click()
    await workpodPage.editOption.click()
    await workpodPage.editingAlert.isVisible()

    await workpodPage.setNameAndDescription(workpodData.updatedName, workpodData.updatedDescription)
    await workpodPage.saveDraftButton.click()
    await workpodPage.verfiyAlertByText('have been saved to your drafts.')
})

for (const record of workpodData.createValidWorkpods) {
    test(`${record.testName}`, async () => {
        const dashboardPage = new DashboardPage(page)
        const workpodPage = new WorkpodPage(page)
        flag = record.isDelete;

        await dashboardPage.workpodSideNav.click()
        await page.waitForLoadState('domcontentloaded')
        await workpodPage.addWorkpod.click()
        await page.waitForSelector('#wb-name-input')
        await workpodPage.setNameAndDescription(record.name, record.description)

        if (record.applications.length > 0) {
            await workpodPage.addApplicationButton.click()
            await page.waitForLoadState('domcontentloaded')
            await workpodPage.checkAllCheckboxesFromJson(record.applications)
            await workpodPage.saveButton.click()
        }

        if (record.groups.length > 0) {
            await workpodPage.addUserGroupButton.click()
            await page.waitForLoadState('domcontentloaded')
            await workpodPage.checkAllCheckboxesFromJson(record.groups)
            await workpodPage.saveButton.click()
        }

        if (record.users.length > 0) {
            await workpodPage.addUserGroupButton.click()
            await workpodPage.userTab.click()
            await page.waitForLoadState('domcontentloaded')
            await workpodPage.checkAllCheckboxesFromJson(record.users)
            await workpodPage.saveButton.click()
        }

        await workpodPage.saveDraftButton.click()
        await workpodPage.verfiyAlertByText(workpodData.validationMessages.newDraftAlertMessage)
        await expect.soft(workpodPage.successMessgae).toContainText(workpodData.validationMessages.workpodCreatedMessage)
    })
}
