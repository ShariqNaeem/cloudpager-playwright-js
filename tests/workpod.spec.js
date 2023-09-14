const { test, expect, request } = require('@playwright/test')
const { LoginPage } = require('../page-object/login-page')
const { DashboardPage } = require('../page-object/dashboard-page')
const { WorkpodPage } = require('../page-object/workpod-page')

import credentials from '../test_data/credentials.json'
import workpodData from '../test_data/workpod.json'


test('Validate that user is able to create the workpod', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await loginPage.openURL(credentials.login.url)
    await loginPage.signInMicrosoft.click()
    await loginPage.enterEmail(credentials.login.email)
    await loginPage.enterPassword(credentials.login.password)
    await loginPage.submitButton.click()
    await page.title('Cloudpager')

    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription(workpodData.name, workpodData.description)
    await workpodPage.addApplicationButton.click()
    await workpodPage.table.isVisible()
    await workpodPage.clickOnCheckBox(1)
    await workpodPage.clickOnCheckBox(2)
    await workpodPage.saveButton.click()

    await workpodPage.addUserGroupButton.click()
    await workpodPage.table.isVisible()
    await workpodPage.clickOnCheckBox(1)
    await workpodPage.clickOnCheckBox(2)

    await workpodPage.userTab.click()
    await page.waitForTimeout(2000)
    await workpodPage.clickOnCheckBox(1)
    await workpodPage.clickOnCheckBox(2)
    await workpodPage.saveButton.click()
    await workpodPage.saveDraftButton.click();

    await expect(workpodPage.alertDialog).toContainText('New draft created.')
    await expect(workpodPage.successMessgae).toContainText('Workpod Created')
})

test('Validate that user is able to update the workpod', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await loginPage.openURL(credentials.login.url)
    await loginPage.signInMicrosoft.click()
    await loginPage.enterEmail(credentials.login.email)
    await loginPage.enterPassword(credentials.login.password)
    await loginPage.submitButton.click()
    await page.title('Cloudpager')

    await page.waitForTimeout(10000)
    await dashboardPage.workpodSideNav.click()
    await page.waitForTimeout(10000)
    await workpodPage.draftsSection.click()
    await page.waitForTimeout(10000)
    await workpodPage.actionButton.click()
    await workpodPage.editOption.click()
    await workpodPage.editingAlert.isVisible()

    await workpodPage.setNameAndDescription(workpodData.updatedName, workpodData.updatedDescription)
    //await page.waitForTimeout(10000)
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
    await workpodPage.publishButton.click()

    await workpodPage.enterPublishComment('Automated comment...')
    await expect(workpodPage.alertDialog).toContainText('have been published successfully.')
})