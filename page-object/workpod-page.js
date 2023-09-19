const { expect } = require('@playwright/test')

exports.WorkpodPage = class WorkpodPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page
        this.addWorkpod = page.locator('span.mat-button-wrapper', { hasText: ' Add Workpod ' })
        this.workpodName = page.locator('#wb-name-input')
        this.workpodDescription = page.locator('[formcontrolname="workpodDescription"]')
        this.addApplicationButton = page.locator('#add-app-btn')
        this.addUserGroupButton = page.locator('#add-user-group-btn')
        this.table = page.locator('table[role="grid"]')
        this.saveButton = page.locator('.dialog-button-container button.btn-save')
        this.saveDraftButton = page.locator('.save-publish-container button.btn-secondary')
        this.publishButton = page.locator('.save-publish-container button.btn-primary')
        this.alertDialog = page.locator('[role="alertdialog"]')
        this.successMessgae = page.locator('#header')
        this.userTab = page.locator('div.dialog-content div.mat-tab-label-content', { hasText: 'Users' })
        this.draftsSection = page.locator('span.mat-button-toggle-label-content', { hasText: ' Drafts ' })
        this.publishedSection = page.locator('span.mat-button-toggle-label-content', { hasText: ' Published ' })
        this.actionButton = page.locator('.cdk-drop-list.drag-drop-list >div:first-child div.wb-card-actions button')
        this.editOption = page.locator('div[role="menu"] span.action-label', { hasText: 'Edit' })
        this.deleteOption = page.locator('div[role="menu"] span.action-label', { hasText: 'Delete' })
        this.manageAdminsOption = page.locator('div[role="menu"] span.action-label', { hasText: 'Manage Admins' })
        this.editingAlert = page.locator('span.alert-text')
        this.addButtonInDraft = page.locator('div.mat-tab-label-content button')
        this.groupAndUsers = page.locator('.mat-tab-label-content', { hasText: 'Groups & Users' })
        this.publishCommentField = page.locator('#publish-comment')
        this.publishBtnModal = page.locator('#publish-btn')
        this.confirmWorkpodNameField = page.locator('input[formcontrolname="confirmName"]')
        this.deleteBtnInModal = page.locator('#confirm-btn')
    }

    async clickOnCheckBox(index) {
        const checkbox = this.page.locator(`tbody tr:nth-child(${index}) td:nth-child(1) span.mat-checkbox-inner-container`)
        await checkbox.click()
        //expect(await checkbox.isChecked()).toBeTruthy()
    }

    async setNameAndDescription(name, description) {
        await this.workpodName.clear()
        await this.workpodName.type(name)
        await this.workpodDescription.clear()
        await this.workpodDescription.type(description)
    }

    async enterPublishComment(comment) {
        await this.publishCommentField.type(comment)
        await this.publishBtnModal.click()
    }

    async enterWorkpodNameAndDelete(name) {
        await this.confirmWorkpodNameField.type(name)
        await this.deleteBtnInModal.click()
    }
};