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
        this.firstWorkpodName = page.locator('.cdk-drop-list.drag-drop-list > div:first-child div.wb-title')
        this.discardDraft = page.locator('#delete-wb-btn')
        this.roleAlert = page.locator('[role="alert"]')
        this.searchInModal = page.locator('[role="dialog"] .mat-form-field-infix input')
    }

    async clickOnCheckBox(index) {
        const checkbox = this.page.locator(`tbody tr:nth-child(${index}) td:nth-child(1) span.mat-checkbox-inner-container`)
        await checkbox.click()
        //expect(await checkbox.isChecked()).toBeTruthy()
    }

    async clickOnCheckBoxByText(name) {
        const checkbox = this.page.locator(`//div[@class="dialog-content"]//td[contains(text(),"${name}")]`)
        await checkbox.first().click()
        //await expect(checkbox).toBeTruthy()
    }

    async setNameAndDescription(name, description) {
        await this.workpodName.clear()
        await this.workpodName.fill(name)
        await this.workpodDescription.clear()
        await this.workpodDescription.fill(description)
    }

    async enterPublishComment(comment) {
        await this.publishCommentField.fill(comment)
        await this.publishBtnModal.click()
    }

    async enterWorkpodNameAndDelete(name) {
        await this.confirmWorkpodNameField.fill(name)
        await this.deleteBtnInModal.click()
    }

    async firstWorkpodText() {
        await this.page.evaluate(() => {
            const parentElement = document.querySelector('.cdk-drop-list.drag-drop-list > div:first-child div.wb-title');
            const childElement = document.querySelector('.cdk-drop-list.drag-drop-list > div:first-child div.wb-title badge');
            const parentText = parentElement.textContent.split(childElement.textContent);
            return parentText[0];
        });
    }

    async deleteFirstWorkpod() {
        //await this.page.waitForTimeout(2000)
        const workpodName = await this.page.evaluate(() => {
            const parentElement = document.querySelector('.cdk-drop-list.drag-drop-list > div:first-child div.wb-title');
            const childElement = document.querySelector('.cdk-drop-list.drag-drop-list > div:first-child div.wb-title badge');
            const parentText = parentElement.textContent.split(childElement.textContent);
            return parentText[0];
        });

        await this.actionButton.click()
        await this.deleteOption.click()
        await this.enterWorkpodNameAndDelete(workpodName.trim());
    }

    generateString(length = 12) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    async checkAllCheckboxes(length = null) {
        await this.page.waitForTimeout(3000)
        const checkboxes = await this.page.$$('tbody tr td:nth-child(1) span.mat-checkbox-inner-container');
        let checkboxesCount = checkboxes.length;

        if (length === null) {
            length = checkboxesCount;
        }

        for (let i = 0; i < length; i++) {
            await checkboxes[i].click();
            await this.page.waitForTimeout(500)
        }
    }

    async checkAllCheckboxesFromJson(namesArray) {
        for (let i = 0; i < namesArray.length; i++) {
            await this.clickOnCheckBoxByText(namesArray[i])
            await this.page.waitForTimeout(200)
        }
    }

    async verfiyAlertByText(text) {
        const alert = await this.page.locator(`//*[@role="alertdialog" and contains(text(), "${text}")]`)
        await expect.soft(alert).toBeVisible()
    }
};