import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const nextCli = join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
const nextProcess = spawn(process.execPath, [nextCli, "dev", ...process.argv.slice(2)], {
  env: process.env,
  stdio: ["inherit", "pipe", "pipe"],
});

let output = "";
let localUrl;
let browserOpened = false;

function handleOutput(chunk, destination) {
  destination.write(chunk);
  output = `${output}${chunk.toString()}`
    .replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, "")
    .slice(-4_000);

  localUrl ??= output.match(/Local:\s+(https?:\/\/\S+)/)?.[1];

  if (!browserOpened && localUrl && /Ready in\s+\S+/.test(output)) {
    browserOpened = true;
    openInChrome(localUrl);
  }
}

function openInChrome(url) {
  const chromePath = [
    process.env.CHROME_PATH,
    process.env.LOCALAPPDATA &&
      join(process.env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe"),
    process.env.PROGRAMFILES &&
      join(process.env.PROGRAMFILES, "Google", "Chrome", "Application", "chrome.exe"),
    process.env["PROGRAMFILES(X86)"] &&
      join(process.env["PROGRAMFILES(X86)"], "Google", "Chrome", "Application", "chrome.exe"),
  ].find((candidate) => candidate && existsSync(candidate));

  console.log(`\nOpening ${url} in Chrome...`);

  const browser = chromePath
    ? spawn(chromePath, [url], { detached: true, stdio: "ignore" })
    : spawn("cmd.exe", ["/d", "/s", "/c", "start", "", "chrome", url], {
        detached: true,
        stdio: "ignore",
      });

  browser.on("error", (error) => {
    console.warn(`\nCould not open Chrome automatically: ${error.message}`);
    console.warn(`Open ${url} manually.`);
  });
  browser.unref();
}

nextProcess.stdout.on("data", (chunk) => handleOutput(chunk, process.stdout));
nextProcess.stderr.on("data", (chunk) => handleOutput(chunk, process.stderr));

nextProcess.on("error", (error) => {
  console.error(`Failed to start Next.js: ${error.message}`);
  process.exitCode = 1;
});

nextProcess.on("exit", (code, signal) => {
  process.exitCode = code ?? (signal === "SIGINT" ? 130 : 1);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => nextProcess.kill(signal));
}
