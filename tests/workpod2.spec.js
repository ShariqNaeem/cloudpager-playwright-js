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

test('Add/Save a workpod without name and description.', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await page.waitForLoadState('load')
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription('', '')
    await expect(workpodPage.roleAlert).toContainText('A value must be provided')
})

test('Add/Save a workpod with three spaces in name and description.', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await page.waitForLoadState('domcontentloaded')
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await workpodPage.workpodName.fill('   ', { delay: 100 });
    await workpodPage.workpodDescription.fill('   ', { delay: 100 });
    await workpodPage.saveDraftButton.click();

    await expect.soft(workpodPage.alertDialog).toContainText('New draft created.')
    await expect.soft(workpodPage.successMessgae).toContainText('Workpod Created')
})

test('Add/Save a workpod with 1 character in name and description', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await page.waitForLoadState('domcontentloaded')
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await page.waitForSelector('#wb-name-input');

    await workpodPage.workpodDescription.fill('@');
    await workpodPage.workpodName.click();
    await expect(workpodPage.roleAlert).toContainText('Value must be at least 3 characters')
    await workpodPage.workpodDescription.clear();
    await workpodPage.workpodName.fill('$');
    await expect(workpodPage.roleAlert).toContainText('Value must be at least 3 characters')
})

test('Add/Save a workpod with 160 characters (Max limit) in name and description', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await page.waitForLoadState('domcontentloaded')
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await page.waitForSelector('#wb-name-input')

    await workpodPage.setNameAndDescription(workpodData.string_160, workpodData.string_160)
    await workpodPage.saveDraftButton.click()
    await expect.soft(workpodPage.successMessgae).toContainText('Workpod Created')
})

test('Add/Save a workpod with greater than 160 characters in name and description', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await page.waitForLoadState('domcontentloaded')
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await page.waitForSelector('#wb-name-input');

    await workpodPage.workpodDescription.fill(workpodData.randomLongString);
    await workpodPage.workpodName.click();
    await expect(workpodPage.roleAlert).toContainText('Value must be at less than 160 characters')
    await workpodPage.workpodDescription.clear();
    await workpodPage.workpodName.fill(workpodData.randomLongString);
    await expect(workpodPage.roleAlert).toContainText('Value must be at less than 160 characters')
})

test('Add/Save a workpod with only 3 special characters in name and description.', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await page.waitForLoadState('domcontentloaded')
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await workpodPage.workpodName.fill('$#@', { delay: 100 });
    await workpodPage.workpodDescription.fill('$#@', { delay: 100 });
    await workpodPage.saveDraftButton.click();

    await expect.soft(workpodPage.alertDialog).toContainText('New draft created.')
    await expect.soft(workpodPage.successMessgae).toContainText('Workpod Created')
})

test('Add/Save a workpod with only 3 numbers in name and description.', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await page.waitForLoadState('domcontentloaded')
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await workpodPage.workpodName.fill('123', { delay: 100 });
    await workpodPage.workpodDescription.fill('123', { delay: 100 });
    await workpodPage.saveDraftButton.click();

    await expect.soft(workpodPage.alertDialog).toContainText('New draft created.')
    await expect.soft(workpodPage.successMessgae).toContainText('Workpod Created')
})

test('Add/Save a workpod with all applications selected.', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await page.waitForLoadState('domcontentloaded')
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription(workpodData.name, workpodData.description)
    await workpodPage.addApplicationButton.click()

    await workpodPage.checkAllCheckboxes()
    await workpodPage.saveButton.click()
    await expect.soft(workpodPage.editingAlert).toContainText('All applications must complete the upload process before this workpod can be published.')
})

test('Add/Save a workpod with all 30 groups selected in it.', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await page.waitForLoadState('domcontentloaded')
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription(workpodData.name, workpodData.description)
    await workpodPage.addUserGroupButton.click()
    await page.waitForLoadState('domcontentloaded')


    await workpodPage.checkAllCheckboxes(30)
    await workpodPage.saveButton.click()
    await workpodPage.saveDraftButton.click();
    await expect.soft(workpodPage.alertDialog).toContainText('New draft created.')
    await expect.soft(workpodPage.successMessgae).toContainText('Workpod Created')
})

test('Add/Save a workpod with all 30 users selected in it.', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await page.waitForLoadState('domcontentloaded')
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription(workpodData.name, workpodData.description)
    await workpodPage.addUserGroupButton.click()
    await page.waitForLoadState('domcontentloaded')
    await workpodPage.userTab.click()

    await workpodPage.checkAllCheckboxes(30)
    await workpodPage.saveButton.click()
    await workpodPage.saveDraftButton.click();
    await expect.soft(workpodPage.successMessgae).toContainText('Workpod Created')
})

test('Create a workpod with all applications selected by using json file', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await page.waitForLoadState('domcontentloaded')
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription(workpodData.name, workpodData.description)
    await workpodPage.addApplicationButton.click()
    await page.waitForLoadState('domcontentloaded')


    await workpodPage.checkAllCheckboxesFromJson(workpodData.applications)
    await workpodPage.saveButton.click()
    await workpodPage.saveDraftButton.click();
    await expect.soft(workpodPage.alertDialog).toContainText('New draft created.')
    await expect.soft(workpodPage.successMessgae).toContainText('Workpod Created')
})

test('Create a workpod with all 100 users selected in it', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await page.waitForLoadState('domcontentloaded')
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription(workpodData.name, workpodData.description)
    await workpodPage.addUserGroupButton.click()
    await page.waitForLoadState('domcontentloaded')
    await workpodPage.userTab.click()

    await workpodPage.checkAllCheckboxesFromJson(workpodData.users)
    await workpodPage.saveButton.click()
    await workpodPage.saveDraftButton.click();
    await expect.soft(workpodPage.successMessgae).toContainText('Workpod Created')
})

test('Create a workpod with all 100 groups selected in it', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await page.waitForLoadState('domcontentloaded')
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription(workpodData.name, workpodData.description)
    await workpodPage.addUserGroupButton.click()
    await page.waitForLoadState('domcontentloaded')


    await workpodPage.checkAllCheckboxesFromJson(workpodData.groups)
    await workpodPage.saveButton.click()
    await workpodPage.saveDraftButton.click();
    await expect.soft(workpodPage.alertDialog).toContainText('New draft created.')
    await expect.soft(workpodPage.successMessgae).toContainText('Workpod Created')
})

test('Create a workpod with Name and Description in french language', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await page.waitForLoadState('domcontentloaded')
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await page.waitForSelector('#wb-name-input')

    await workpodPage.setNameAndDescription(workpodData.frenchName, workpodData.frenchDescription)
    await workpodPage.saveDraftButton.click()
    await expect.soft(workpodPage.successMessgae).toContainText('Workpod Created')
})

test('Under the Negative/Edge cases, be sure to test editing with 0 apps and 0 users/groups.', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor();
    await dashboardPage.workpodSideNav.click()
    await workpodPage.draftsSection.click()
    await workpodPage.actionButton.click()
    await workpodPage.editOption.click()
    await workpodPage.editingAlert.isVisible()

    await workpodPage.setNameAndDescription(workpodData.updatedName, workpodData.updatedDescription)
    await workpodPage.saveDraftButton.click()
    await expect.soft(workpodPage.alertDialog).toContainText('have been saved to your drafts.')
})