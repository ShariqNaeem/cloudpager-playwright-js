const { exec } = require("child_process");

export async function execCommand(command) {
  const result = await new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        console.log(stdout)
        resolve();
      }
    });
  });
}
