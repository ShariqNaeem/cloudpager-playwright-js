const { expect } = require('@playwright/test')

exports.WorkpodPage = class WorkpodPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page
        this.addWorkpod = page.locator('span.mat-button-wrapper', { hasText: ' Add Workpod ' })
        this.workpodName = page.locator('#wb-name-input')
        this.workpodDescription = page.locator('#mat-input-1')
        this.addApplicationButton = page.locator('#add-app-btn')
        this.addUserGroupButton = page.locator('#add-user-group-btn')
        this.table = page.locator('table[role="grid"]')
        this.saveButton = page.locator('.dialog-button-container button.btn-save')
        this.saveDraftButton = page.locator('.save-publish-container button.btn-secondary')
        this.publishButton = page.locator('.save-publish-container button.btn-primary')
        this.alertDialog = page.locator('[role="alertdialog"]')
        this.successMessgae = page.locator('#header')
        this.userTab = page.locator('div.mat-tab-label-content', { hasText: 'Users' })


    }

    async clickOnCheckBox(index) {
        const checkbox = this.page.locator(`tbody tr:nth-child(${index}) td:nth-child(1) span.mat-checkbox-inner-container`)
        await checkbox.click()
        expect(await checkbox.isChecked()).toBeTruthy()
    }

    async setNameAndDescription(name, description) {
        await this.workpodName.type(name);
        await this.workpodDescription.type(description);
    }
};