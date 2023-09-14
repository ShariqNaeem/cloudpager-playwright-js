const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.workpodSideNav = page.locator('[href="/admin/workpods"]');
    }
};