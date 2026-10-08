import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function predictLearner(profile) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(
      __dirname,
      "..",
      "ml",
      "predict_api.py"
    );

    const pythonCommand =
  process.platform === "win32" ? "python" : "python3";

const python = spawn(pythonCommand, [scriptPath]);

    let output = "";
    let errorOutput = "";

    python.stdin.write(JSON.stringify(profile));
    python.stdin.end();

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            errorOutput ||
              `Python process exited with code ${code}`
          )
        );
        return;
      }

      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch {
        reject(
          new Error(
            `Invalid ML response: ${output}`
          )
        );
      }
    });
  });
}