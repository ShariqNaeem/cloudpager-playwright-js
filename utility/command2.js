const { exec } = require("child_process");
const { expect } = require("@playwright/test");

export async function execCommand(
  command,
  isValidateMessage = false,
  message = ""
) {
  try {
    await exec(command , (error, stdout, stderr)=> {
      if (error && isValidateMessage) {
        expect(error.message).toContain(message);
      }
    });
    return;
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}
