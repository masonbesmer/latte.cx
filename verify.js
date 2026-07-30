// Parse the filesystem from the source
const fs = require("fs");
const source = fs.readFileSync("./src/lib/terminal/filesystem.ts", "utf8");

// Extract path checks
const paths = [
  "/etc/.terminal.conf",
  "/home/vault_dweller/PERSONAL_LOG.txt",
  "/home/vault_dweller/notes/TODO.txt",
  "/var/logs/system.log",
  "/vault/MANIFEST.txt",
  "/vault/residents/roster.txt",
  "/vault/records/incident_47.txt",
  "/ROBCO_README.txt",
];

// Simple check: look for key strings in source
const issues = [];
paths.forEach((path) => {
  if (!source.includes(path.split("/").pop())) {
    issues.push(`Missing: ${path}`);
  }
});

// Verify key content
if (!source.includes("COLOR_SCHEME=green"))
  issues.push("Missing COLOR_SCHEME=green content");
if (!source.includes("PERSONAL LOG"))
  issues.push("Missing PERSONAL_LOG.txt content");
if (!source.includes("TODO.txt")) issues.push("Missing TODO.txt");
if (!source.includes("system.log")) issues.push("Missing system.log");
if (!source.includes("MANIFEST.txt")) issues.push("Missing MANIFEST.txt");
if (!source.includes("incident_47.txt")) issues.push("Missing incident_47.txt");
if (!source.includes("ROBCO_README.txt"))
  issues.push("Missing ROBCO_README.txt");

// Check function signatures
if (
  !source.includes(
    "export function resolvePath(cwd: string, target: string): string",
  )
) {
  issues.push("resolvePath signature incorrect");
}
if (
  !source.includes(
    "export function getNode(path: string, fs: DirNode = filesystem): FSNode | null",
  )
) {
  issues.push("getNode signature incorrect");
}

console.log(
  issues.length
    ? "ISSUES FOUND:\n" + issues.join("\n")
    : "All required paths and functions found ✓",
);
