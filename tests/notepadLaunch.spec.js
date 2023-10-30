const { exec } = require("child_process");
const { test } = require("@playwright/test");

test("Launch and Close Notepad++", async ({ page }) => {
  const notepadPlusPlusPath = '"C:\\Program Files\\Notepad++\\notepad++.exe"';

  exec(notepadPlusPlusPath, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log("Notepad++ has been launched");
  });

  await page.waitForTimeout(10000);
  console.log("Notepad++ CLOSING");

  exec(`taskkill /F /IM notepad++.exe`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error killing Notepad++: ${error.message}`);
    }
    console.log("Notepad++ has been closed");
  });
});
