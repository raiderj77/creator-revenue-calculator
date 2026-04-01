/**
 * content-lint.js — Content compliance linter for creatorrevenuecalculator.com
 * Scans content/**\/*.{md,mdx} and src/**\/*.{tsx,ts} for:
 *   - Personal name exposure (site owner)
 *   - Guaranteed earnings language (site must show estimates only)
 * Exit code 1 on failure, 0 on pass.
 */

import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { resolve, dirname, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

let failures = 0;

function fail(file, line, msg) {
  const rel = relative(ROOT, file);
  console.error(`  ❌ ${rel}:${line} — ${msg}`);
  failures++;
}

function getFiles(dir, extensions) {
  const results = [];
  if (!existsSync(dir)) return results;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getFiles(fullPath, extensions));
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

/**
 * Check for personal name exposure.
 * The site owner's name must never appear in public content or code.
 */
function checkPersonalName(file, lines) {
  const namePattern = /\bJason\s+Ramirez\b/i;
  for (let i = 0; i < lines.length; i++) {
    if (namePattern.test(lines[i])) {
      fail(file, i + 1, "Personal name detected — never expose site owner's name");
    }
  }
}

/**
 * Check for guaranteed earnings language.
 * This site shows estimates only — never guaranteed figures.
 * Skip lines that are clearly negating the claim (e.g. "not guaranteed income").
 */
function checkGuaranteedEarnings(file, lines) {
  const guaranteedPhrases = [
    { pattern: /you will earn/i, label: '"you will earn"' },
    { pattern: /guaranteed income/i, label: '"guaranteed income"' },
    { pattern: /exact earnings/i, label: '"exact earnings"' },
    { pattern: /will make \$/i, label: '"will make $"' },
  ];

  // Lines negating the claim are compliant disclaimers — skip them
  const negationPattern = /\b(not|no|never|non-|aren't|isn't|aren't|aren't)\b/i;

  for (let i = 0; i < lines.length; i++) {
    for (const { pattern, label } of guaranteedPhrases) {
      if (pattern.test(lines[i]) && !negationPattern.test(lines[i])) {
        fail(
          file,
          i + 1,
          `Guaranteed earnings language detected (${label}) — use estimate language instead`
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log("📊 Creator Revenue Calculator content lint\n");

const contentFiles = getFiles(resolve(ROOT, "content"), [".md", ".mdx"]);
const srcFiles = getFiles(resolve(ROOT, "src"), [".tsx", ".ts"]);
const allFiles = [...contentFiles, ...srcFiles];

console.log(`  Scanning ${contentFiles.length} content files and ${srcFiles.length} source files...\n`);

for (const file of allFiles) {
  const content = readFileSync(file, "utf-8");
  const lines = content.split("\n");

  checkPersonalName(file, lines);
  checkGuaranteedEarnings(file, lines);
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log("\n" + "=".repeat(50));
if (failures > 0) {
  console.error(`\n💥 ${failures} content issue(s) found — fix before deploying.\n`);
  process.exit(1);
} else {
  console.log("\n🎉 All content checks passed.\n");
  process.exit(0);
}
