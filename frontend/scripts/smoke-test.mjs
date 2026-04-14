import { spawn } from "node:child_process";

/**
 * Run shell command and stream output with inherited stdio.
 */
function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: false,
      ...options,
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(" ")} failed with code ${code}`));
      }
    });
  });
}

/**
 * Wait until URL responds with expected HTTP status.
 */
async function waitForUrl(url, timeoutMs = 30000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.status >= 200 && response.status < 500) {
        return response;
      }
    } catch {
      // Retry until timeout.
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Timeout waiting for ${url}`);
}

/**
 * Execute smoke test by building app, starting server, then checking login page.
 */
async function main() {
  const port = process.env.FRONTEND_PORT ?? "3000";

  await run("npm", ["run", "build"]);

  const server = spawn("npm", ["run", "start", "--", "-p", port], {
    stdio: "inherit",
    shell: false,
    env: process.env,
  });

  try {
    await waitForUrl(`http://127.0.0.1:${port}/login`);
    const response = await fetch(`http://127.0.0.1:${port}/login`);
    const html = await response.text();

    if (!html.includes("Login")) {
      throw new Error("Smoke check failed: /login page does not contain expected text");
    }

    console.log("Frontend smoke test passed.");
  } finally {
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
