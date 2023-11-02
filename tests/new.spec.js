import util from 'util';
const exec = util.promisify(childProcess.exec);
// const { exec } = require("child_process");
const { test } = require("@playwright/test");
import childProcess from 'child_process';

// Function to launch an application using exec
const launchApplication = async (applicationPath) => {
    try {
        const { stdout, stderr } = await exec(applicationPath);
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
      } catch (e) {
        console.error('Error:', e);
      }
};

// Function to close an application using taskkill
const closeApplication = async (applicationName) => {
  return new Promise((resolve, reject) => {
    exec(`taskkill /F /IM ${applicationName}`, (error, stdout, stderr) => {
        console.log("closeApplication")
      if (error) {
        console.log(`Error closing application: ${error.message}`)
        reject(`Error closing application: ${error.message}`);
      } else {
        console.log(stdout)
        resolve(stdout);
      }
    });
  });
};

test("Launch and Close Notepad++", async ({ page }) => {
  const notepadPlusPlusPath = '"C:\\Program Files\\Notepad++\\notepad++.exe"';
  console.log("Notepad++");

  try {
    // Launch Notepad++
    await launchApplication(notepadPlusPlusPath);
    console.log("Notepad++ has been launched");

    // Wait for a specific duration
    await page.waitForTimeout(10000);
    console.log("Waiting for 10 seconds");

    // Close Notepad++
    await closeApplication("notepad++.exe");
    console.log("Notepad++ has been closed");
  } catch (error) {
    console.error(error);
  }
});
