const { exec, spawn } = require("child_process");
const { test, expect } = require("@playwright/test");
import { execCommand } from "../utility/command";

test("Failing the test case when the exe file path is incorrect", async ({ page }) => {
  const incorrectCommand = '"C:\\Program Files\\Notepad++\\notepad++.exe"';
  const kill = 'taskkill /F /IM notepad++.exe';

  try {
    const result = await execCommand(incorrectCommand);
  } catch (error) {
    console.error('Error:', error);
    await expect(error.message).toContain('The system cannot find the path specified.'); 
  }

  await page.waitForTimeout(10000)

  try {
    const result = await execCommand(kill);
  } catch (error) {
    console.error('Error:', error);
    await expect(error.message).toContain('The system cannot find the path specified.'); 
  }
});
