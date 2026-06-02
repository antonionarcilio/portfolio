#!/usr/bin/env node
import { execFileSync, spawn } from 'child_process';
import { existsSync, unlinkSync } from 'fs';
import { chromium } from 'playwright';

const PORT = 3001;
const TARGET_URL = `http://localhost:${PORT}/portfolios/gamer`;
const OUTPUT_PATH = 'public/portfolios/gamer/og-gamer.webp';
const SERVER_TIMEOUT_MS = 30_000;

async function waitForServer(url) {
  const deadline = Date.now() + SERVER_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      await fetch(url);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error(`Server at ${url} did not start within ${SERVER_TIMEOUT_MS / 1000}s`);
}

async function generateOgImage() {
  if (process.env.VERCEL) {
    console.log('Vercel detected — skipping OG generation, using committed public/og-gamer.png');
    return;
  }

  if (!existsSync('.next')) {
    throw new Error('Run `pnpm build` before generating OG images.');
  }

  console.log('Starting production server on port', PORT);
  const server = spawn('/bin/sh', ['-c', `node_modules/.bin/next start -p ${PORT}`], {
    stdio: 'ignore',
  });

  let browser;
  try {
    await waitForServer(`http://localhost:${PORT}`);
    console.log('Server ready. Taking screenshot...');

    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1200, height: 630 });
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    // Wait for Framer Motion entrance animations to settle
    await page.waitForTimeout(6000);

    const tmpPath = OUTPUT_PATH.replace('.webp', '.tmp.png');
    await page.screenshot({ path: tmpPath, type: 'png' });
    execFileSync('magick', [tmpPath, '-quality', '90', OUTPUT_PATH]);
    unlinkSync(tmpPath);
    console.log(`✓ OG image saved to ${OUTPUT_PATH}`);
  } finally {
    await browser?.close();
    server.kill();
  }
}

generateOgImage().catch((err) => {
  console.error('Error generating OG image:', err.message);
  process.exit(1);
});
