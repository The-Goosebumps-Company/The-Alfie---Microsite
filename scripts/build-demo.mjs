// Builds the GitHub Pages demo into ./out without touching the working copy:
// copies the project to .demo-build/, removes the server-only routes, swaps in the
// browser-only bench page, and runs a static export there.
// Usage: PAGES_BASE_PATH=/The-Alfie---Microsite node scripts/build-demo.mjs
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, symlinkSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const tmp = path.join(root, ".demo-build");
const skip = new Set(["node_modules", ".next", "out", ".git", ".demo-build", ".data"]);

rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp);
for (const name of readdirSync(root)) {
  if (!skip.has(name)) cpSync(path.join(root, name), path.join(tmp, name), { recursive: true });
}
symlinkSync(path.join(root, "node_modules"), path.join(tmp, "node_modules"), "dir");

// No server on GitHub Pages: drop the API routes and the local design board.
for (const dir of ["src/app/api", "src/app/dev"]) rmSync(path.join(tmp, dir), { recursive: true, force: true });
cpSync(path.join(tmp, "src/demo/BenchPage.tsx"), path.join(tmp, "src/app/bench/page.tsx"));
cpSync(path.join(tmp, "src/demo/BenchPage.tsx"), path.join(tmp, "src/app/page.tsx"));

execSync("node node_modules/next/dist/bin/next build", {
  cwd: tmp,
  stdio: "inherit",
  env: { ...process.env, STATIC_DEMO: "1" },
});

rmSync(path.join(root, "out"), { recursive: true, force: true });
cpSync(path.join(tmp, "out"), path.join(root, "out"), { recursive: true });
rmSync(tmp, { recursive: true, force: true });
console.log(existsSync(path.join(root, "out/index.html")) ? "Demo built in ./out" : "Build finished but out/index.html is missing");
