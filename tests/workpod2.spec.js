const { test, expect, request } = require('@playwright/test')
const { LoginPage } = require('../page-object/login-page')
const { DashboardPage } = require('../page-object/dashboard-page')
const { WorkpodPage } = require('../page-object/workpod-page')

import credentials from '../test_data/credentials.json'
import workpodData from '../test_data/workpod.json'
const records = workpodData.workpods

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

test('Add/Save a workpod without name and description.', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)
    flag = false;

    await page.waitForLoadState('load')
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription('', '')
    await expect(workpodPage.roleAlert).toContainText('A value must be provided')
})

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

test('Add/Save a workpod with 1 character in name and description', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)
    flag = false;

    await dashboardPage.workpodSideNav.click()
    await page.waitForLoadState('domcontentloaded')
    await workpodPage.addWorkpod.click()
    await page.waitForSelector('#wb-name-input');

    await workpodPage.workpodDescription.fill('@');
    await workpodPage.workpodName.click();
    await expect(workpodPage.roleAlert).toContainText('Value must be at least 3 characters')
    await workpodPage.workpodDescription.clear();
    await workpodPage.workpodName.fill('$');
    await expect(workpodPage.roleAlert).toContainText('Value must be at least 3 characters')
})

test('Add/Save a workpod with greater than 160 characters in name and description', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)
    flag = false;

    await dashboardPage.workpodSideNav.click()
    await page.waitForLoadState('domcontentloaded')
    await workpodPage.addWorkpod.click()
    await page.waitForSelector('#wb-name-input');

    await workpodPage.workpodDescription.fill(workpodData.randomLongString);
    await workpodPage.workpodName.click();
    await expect(workpodPage.roleAlert).toContainText('Value must be at less than 160 characters')
    await workpodPage.workpodDescription.clear();
    await workpodPage.workpodName.fill(workpodData.randomLongString);
    await expect(workpodPage.roleAlert).toContainText('Value must be at less than 160 characters')
})

test('Add/Save a workpod with all 30 applications selected.', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)
    flag = true;

    await dashboardPage.workpodSideNav.waitFor()
    await dashboardPage.workpodSideNav.click()
    await page.waitForLoadState('domcontentloaded')

    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription(workpodData.name, workpodData.description)
    await workpodPage.addApplicationButton.click()
    await workpodPage.checkAllCheckboxes(30)
    await workpodPage.saveButton.click()
    //await expect.soft(workpodPage.editingAlert).toContainText('All applications must complete the upload process before this workpod can be published.')
    await workpodPage.saveDraftButton.click()

    await workpodPage.verfiyAlertByText('New draft created.')
    await expect.soft(workpodPage.successMessgae).toContainText('Workpod Created')
})

test('Add/Save a workpod with all 30 groups selected in it.', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)
    flag = true;

    await dashboardPage.workpodSideNav.click()
    await page.waitForLoadState('domcontentloaded')
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription(workpodData.name, workpodData.description)
    await workpodPage.addUserGroupButton.click()

    await workpodPage.checkAllCheckboxes(30)
    await workpodPage.saveButton.click()
    await workpodPage.saveDraftButton.click();
    await workpodPage.verfiyAlertByText('New draft created.')
    await expect.soft(workpodPage.successMessgae).toContainText('Workpod Created')
})

test('Add/Save a workpod with all 30 users selected in it.', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)
    flag = true;

    await dashboardPage.workpodSideNav.click()
    await page.waitForLoadState('domcontentloaded')
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription(workpodData.name, workpodData.description)
    await workpodPage.addUserGroupButton.click()
    await page.waitForLoadState('domcontentloaded')
    await workpodPage.userTab.click()

    await workpodPage.checkAllCheckboxes(30)
    await workpodPage.saveButton.click()
    await workpodPage.saveDraftButton.click();
    await workpodPage.verfiyAlertByText('New draft created.')
    await expect.soft(workpodPage.successMessgae).toContainText('Workpod Created')
})

test('Create a workpod with all applications selected by using json file', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)
    flag = true;

    await dashboardPage.workpodSideNav.click()
    await page.waitForLoadState('domcontentloaded')
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription(workpodData.name, workpodData.description)
    await workpodPage.addApplicationButton.click()
    await page.waitForLoadState('domcontentloaded')

    await workpodPage.checkAllCheckboxesFromJson(workpodData.applications)
    await workpodPage.saveButton.click()
    //await expect.soft(workpodPage.editingAlert).toContainText('All applications must complete the upload process before this workpod can be published.')
    await workpodPage.saveDraftButton.click()
    await workpodPage.verfiyAlertByText('New draft created.')
    await expect.soft(workpodPage.successMessgae).toContainText('Workpod Created')
})

test('Create a workpod with all 100 users selected in it', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)
    flag = true;

    await dashboardPage.workpodSideNav.click()
    await page.waitForLoadState('domcontentloaded')
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription(workpodData.name, workpodData.description)
    await workpodPage.addUserGroupButton.click()
    await page.waitForLoadState('domcontentloaded')
    await workpodPage.userTab.click()

    await workpodPage.checkAllCheckboxesFromJson(workpodData.users)
    await workpodPage.saveButton.click()
    await workpodPage.saveDraftButton.click();
    await workpodPage.verfiyAlertByText('New draft created.')
    await expect.soft(workpodPage.successMessgae).toContainText('Workpod Created')
})

test('Create a workpod with all 100 groups selected in it', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)
    flag = true;

    await dashboardPage.workpodSideNav.click()
    await page.waitForLoadState('domcontentloaded')
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription(workpodData.name, workpodData.description)
    await workpodPage.addUserGroupButton.click()
    await page.waitForLoadState('domcontentloaded')


    await workpodPage.checkAllCheckboxesFromJson(workpodData.groups)
    await workpodPage.saveButton.click()
    await workpodPage.saveDraftButton.click();
    await workpodPage.verfiyAlertByText('New draft created.')
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

for (const record of records) {
    test(`Add/Save a workpod with Name and Description for testcase: ${record.testName}`, async () => {
        const dashboardPage = new DashboardPage(page)
        const workpodPage = new WorkpodPage(page)
        flag = true;

        await dashboardPage.workpodSideNav.click()
        await page.waitForLoadState('domcontentloaded')
        await workpodPage.addWorkpod.click()
        await page.waitForSelector('#wb-name-input')

        await workpodPage.setNameAndDescription(record.name, record.description)
        await workpodPage.saveDraftButton.click()
        await workpodPage.verfiyAlertByText('New draft created.')
        await expect.soft(workpodPage.successMessgae).toContainText('Workpod Created')
    })
}
