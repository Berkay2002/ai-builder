#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeFileSafe(targetPath, content) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, content);
}

function replacePlaceholdersInText(text, replacements) {
  return Object.entries(replacements).reduce((acc, [key, value]) => {
    const pattern = new RegExp(`\\{\\{${key}\\}}`, 'g');
    return acc.replace(pattern, String(value ?? ''));
  }, text);
}

function applyRepoParameterization(repoRoot, replacements) {
  const filesToParam = [
    'package.json',
    'src/libs/stripe/stripe-admin.ts',
    'src/components/logo.tsx',
    'src/app/layout.tsx',
    'src/app/(auth)/auth-ui.tsx',
  ];

  for (const rel of filesToParam) {
    const abs = path.join(repoRoot, rel);
    if (!fs.existsSync(abs)) continue;
    const original = fs.readFileSync(abs, 'utf8');
    const updated = replacePlaceholdersInText(original, replacements);
    if (updated !== original) {
      fs.writeFileSync(abs, updated);
      console.log(`[transform] updated ${rel}`);
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  const manifestFlagIndex = args.indexOf('--manifest');
  const manifestPath = manifestFlagIndex >= 0 ? args[manifestFlagIndex + 1] : null;
  if (!manifestPath) {
    console.error('Usage: node generator/transform.js --manifest <path>');
    process.exit(1);
  }

  const repoRoot = process.cwd();
  const manifest = readJSON(path.resolve(manifestPath));

  const replacements = {
    APP_NAME: manifest.app_name,
    APP_DISPLAY_NAME: manifest.app_display_name || manifest.app_name,
    APP_TAGLINE: manifest.app_tagline || '',
    SUPABASE_PROJECT_ID: manifest.integrations?.supabase?.project_id || '',
    STRIPE_CLI_PROJECT_NAME: manifest.integrations?.stripe?.cli_project_name || '',
    STRIPE_APP_NAME: manifest.integrations?.stripe?.app_name || manifest.app_name,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: manifest.integrations?.stripe?.publishable_key || '',
  };

  applyRepoParameterization(repoRoot, replacements);

  const envTemplateCandidates = [
    path.join(repoRoot, '.env.template'),
    path.join(repoRoot, 'env.template')
  ];
  const envTemplatePath = envTemplateCandidates.find(p => fs.existsSync(p));
  if (envTemplatePath) {
    const template = fs.readFileSync(envTemplatePath, 'utf8');
    const envResolved = replacePlaceholdersInText(template, replacements);
    writeFileSafe(path.join(repoRoot, '.env.local'), envResolved);
    console.log('[transform] wrote .env.local');
  } else {
    console.warn('[transform] .env.template/env.template not found; skipping env generation');
  }

  console.log('[transform] done');
}

main();


