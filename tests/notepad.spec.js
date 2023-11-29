const { test } = require("@playwright/test");
import { execCommand } from "../utility/command2";

test("Launch and Close Notepad++", async ({ page }) => {
  // console.log("Notepad++ has been launched");
  const notepadPlusPlusPath = '"C:\\Program Files\\Notepad++\\notepad.exe"';
  // await execCommand(notepadPlusPlusPath);
  // try {
    await execCommand(notepadPlusPlusPath, true, "hdsabfjfh");
    // console.log(`result: ${result}`);

  // } catch (error) {
  //   console.log(`Error: ${error.message}`);
  // }
  await page.waitForTimeout(5000)
  const kill = 'taskkill /F /IM notepad++.exe';
  await execCommand(kill);


  // const launchNotepadPlusPlus = await exec(
  //   '"C:\\Program Files\\Notepad++\\notepad++.exe"'
  // );
  // console.log("Notepad++ has been launched");

  // await page.waitForTimeout(10000);
  // console.log("Notepad++ CLOSING");

  // exec(`taskkill /F /IM notepad++.exe`, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`Error closing Notepad++: ${error.message}`);
  //   }
  //   console.log("Notepad++ has been closed");
  // });
});
