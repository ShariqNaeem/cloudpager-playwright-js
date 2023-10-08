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

test('Validate that user is able to create the workpod and save it to draft.', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor();
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription(workpodData.sampleWorkpod.name, workpodData.sampleWorkpod.description)
    await workpodPage.addApplicationButton.click()

    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.applications[0])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.applications[1])
    await workpodPage.saveButton.click()

    await workpodPage.addUserGroupButton.click()
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.groups[0])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.groups[1])

    await workpodPage.userTab.click()
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.users[0])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.users[1])
    await workpodPage.saveButton.click()
    await workpodPage.saveDraftButton.click();

    await expect.soft(workpodPage.alertDialog).toContainText(workpodData.validationMessages.newDraftAlertMessage)
    await expect.soft(workpodPage.successMessgae).toContainText(workpodData.validationMessages.workpodCreatedMessage)
})

test('Go to Drafts section and delete any existing Draft.', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor();
    await dashboardPage.workpodSideNav.click()
    await workpodPage.draftsSection.click()

    await workpodPage.firstWorkpodName.waitFor();
    await expect.soft(workpodPage.firstWorkpodName).toContainText(workpodData.sampleWorkpod.name)
    await workpodPage.deleteFirstWorkpod();
    await expect.soft(workpodPage.alertDialog).toContainText(workpodData.validationMessages.deleteWorkpodMessage)
})

test('Validate that user is able to create the workpod and publish it', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor();
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription(workpodData.sampleWorkpod.name, workpodData.sampleWorkpod.description)
    await workpodPage.addApplicationButton.click()

    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.applications[0])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.applications[1])
    await workpodPage.saveButton.click()

    await workpodPage.addUserGroupButton.click()
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.groups[0])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.groups[1])

    await workpodPage.userTab.click()
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.users[0])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.users[1])
    await workpodPage.saveButton.click()
    await workpodPage.publishButton.click();

    await workpodPage.enterPublishComment(workpodData.sampleWorkpod.comment)
    await expect.soft(workpodPage.alertDialog).toContainText(workpodData.validationMessages.newPublishAlertMessage)
    await expect.soft(workpodPage.successMessgae).toContainText(workpodData.validationMessages.workpodCreatedMessage)
})

test('Go to Published Workpod section and Edit any published workpod and then Saved it as a draft', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor();
    await dashboardPage.workpodSideNav.click()
    await workpodPage.publishedSection.click()
    await workpodPage.firstWorkpodName.waitFor();
    await expect.soft(workpodPage.firstWorkpodName).toContainText(workpodData.sampleWorkpod.name)

    await workpodPage.actionButton.click()
    await workpodPage.editOption.click()
    await workpodPage.editingAlert.isVisible()

    const randomName = workpodPage.generateString();
    await workpodPage.setNameAndDescription(randomName, workpodData.sampleWorkpod.updatedDescription)
    await workpodPage.addButtonInDraft.click({ force: true });

    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.applications[2])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.applications[3])
    await workpodPage.saveButton.click()


    await workpodPage.groupAndUsers.click()
    await workpodPage.addButtonInDraft.click({ force: true })

    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.groups[0])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.groups[1])

    await workpodPage.userTab.click()
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.users[1])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.users[2])
    await workpodPage.saveButton.click()
    await workpodPage.saveDraftButton.click()
    await expect.soft(workpodPage.alertDialog).toContainText(workpodData.validationMessages.saveToDraftsMessage)
})

test('Go to Draft workpod, Edit it but dont save it, just discard at the end', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor();
    await dashboardPage.workpodSideNav.click()
    await workpodPage.draftsSection.click()
    await workpodPage.actionButton.click()
    await workpodPage.editOption.click()
    await workpodPage.editingAlert.isVisible()

    await workpodPage.setNameAndDescription(workpodData.sampleWorkpod.updatedName, workpodData.sampleWorkpod.updatedDescription)
    await workpodPage.addButtonInDraft.click({ force: true });
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.applications[0])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.applications[4])
    await workpodPage.saveButton.click()

    await workpodPage.groupAndUsers.click()
    await workpodPage.addButtonInDraft.click({ force: true })
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.groups[0])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.groups[1])

    await workpodPage.userTab.click()
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.users[1])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.users[2])
    await workpodPage.saveButton.click()
    await workpodPage.discardDraft.click()
    await expect.soft(workpodPage.alertDialog).toContainText(workpodData.validationMessages.removeFromDraftMessage)

})

test('Go to Published Workpod section and Edit any published workpod and then Saved it', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor();
    await dashboardPage.workpodSideNav.click()
    await workpodPage.publishedSection.click()
    await workpodPage.actionButton.click()
    await workpodPage.editOption.click()
    await workpodPage.editingAlert.isVisible()

    const randomName = workpodPage.generateString();
    await workpodPage.setNameAndDescription(randomName, workpodData.sampleWorkpod.updatedDescription)
    await workpodPage.addButtonInDraft.click({ force: true });

    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.applications[2])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.applications[3])
    await workpodPage.saveButton.click()

    await workpodPage.groupAndUsers.click()
    await workpodPage.addButtonInDraft.click({ force: true })

    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.groups[1])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.groups[2])

    await workpodPage.userTab.click()
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.users[0])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.users[1])
    await workpodPage.saveButton.click()
    await workpodPage.saveDraftButton.click()
    await expect.soft(workpodPage.alertDialog).toContainText(workpodData.validationMessages.saveToDraftsMessage)
})

test('Validate that user is able to edit the workpod and publish it', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor();
    await dashboardPage.workpodSideNav.click()
    await workpodPage.draftsSection.click()
    await workpodPage.actionButton.click()
    await workpodPage.editOption.click()
    await workpodPage.editingAlert.isVisible()

    await workpodPage.setNameAndDescription(workpodData.sampleWorkpod.updatedName, workpodData.sampleWorkpod.updatedDescription)
    await workpodPage.addButtonInDraft.click({ force: true });
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.applications[4])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.applications[3])
    await workpodPage.saveButton.click()

    await workpodPage.groupAndUsers.click()
    await workpodPage.addButtonInDraft.click({ force: true })
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.groups[2])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.groups[3])

    await workpodPage.userTab.click()
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.users[2])
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.users[3])
    await workpodPage.saveButton.click()
    await workpodPage.publishButton.click()

    await workpodPage.enterPublishComment(workpodData.sampleWorkpod.comment)
    await expect.soft(workpodPage.alertDialog).toContainText(workpodData.validationMessages.publishWorkpodMessage)

})

test('Go to published tab and delete any workpod', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor();
    await dashboardPage.workpodSideNav.click()
    await workpodPage.publishedSection.click()

    await workpodPage.firstWorkpodName.waitFor();
    await workpodPage.deleteFirstWorkpod();
    await expect.soft(workpodPage.alertDialog).toContainText(workpodData.validationMessages.deleteWorkpodMessage)
})

test('Switching between the filters, draft, publish, and all', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor()
    await dashboardPage.workpodSideNav.click()
    await expect(page).toHaveURL(/.*all/)

    await workpodPage.draftsSection.click()
    await expect(page).toHaveURL(/.*draft/)

    await workpodPage.publishedSection.click()
    await expect(page).toHaveURL(/.*publish/)
})

test('Validate the change policy while user edit the workpod', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor()
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription(workpodData.sampleWorkpod.name, workpodData.sampleWorkpod.description)
    await workpodPage.addApplicationButton.click()

    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.applications[1])
    await workpodPage.saveButton.click()

    await workpodPage.addUserGroupButton.click()
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.groups[1])

    await workpodPage.userTab.click()
    await workpodPage.clickOnCheckBoxByText(workpodData.sampleWorkpod.users[1])
    await workpodPage.saveButton.click()
    await workpodPage.publishButton.click();

    await workpodPage.enterPublishComment(workpodData.sampleWorkpod.comment)
    await expect.soft(workpodPage.alertDialog).toContainText(workpodData.validationMessages.newPublishAlertMessage)
    await expect.soft(workpodPage.successMessgae).toContainText(workpodData.validationMessages.workpodCreatedMessage)

    await dashboardPage.workpodSideNav.click()
    await workpodPage.publishedSection.click()
    await workpodPage.firstWorkpodCard.waitFor()
    await workpodPage.firstWorkpodCard.click()
    await workpodPage.editButton.click()
    await workpodPage.actionButtonsInEdit.first().click()
    await expect(workpodPage.changePolicyOption).toBeVisible()
})