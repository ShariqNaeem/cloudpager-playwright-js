const { exec  } = require("child_process");

export async function execCommand(command) {
  try {
      await exec(command);
      return;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}