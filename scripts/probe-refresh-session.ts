/**
 * refreshSession() request-count probe (src/lib/authApi.ts).
 *
 * Bundles the real module with esbuild (import.meta.env defined, as Vite would),
 * replaces fetch with scripted /auth/refresh responses and counts requests per
 * scenario. No network, no server, no accounts. PROBE_AUTH_API may point at
 * another copy of authApi.ts (e.g. a previous commit) to compare behaviour.
 *
 *   npx tsx scripts/probe-refresh-session.ts
 */
import { build } from 'esbuild';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

type Step = { status: number; body: unknown; delayMs?: number };
type Mod = { refreshSession: () => Promise<{ accessToken?: string } | null> };

const results: Array<{ id: string; ok: boolean }> = [];
const mark = (id: string, ok: boolean, detail?: unknown) => {
  results.push({ id, ok });
  console.log(ok ? 'PASS' : 'FAIL', id, ok ? '' : String(detail ?? ''));
};

let calls = 0;
let script: Step[] = [];
const refreshCalls: string[] = [];

(globalThis as { fetch: unknown }).fetch = async (url: string, init?: { method?: string }) => {
  if (!String(url).endsWith('/auth/refresh') || init?.method !== 'POST') throw new Error(`unexpected request ${url}`);
  calls += 1;
  refreshCalls.push(String(url));
  const step = script.shift() ?? { status: 500, body: { error: 'script exhausted' } };
  if (step.delayMs) await new Promise((r) => setTimeout(r, step.delayMs));
  return new Response(JSON.stringify(step.body), { status: step.status, headers: { 'Content-Type': 'application/json' } });
};

async function load(): Promise<Mod> {
  const entry = resolve(process.env.PROBE_AUTH_API || 'src/lib/authApi.ts');
  const out = await build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'neutral',
    define: { 'import.meta.env': '{}' },
    logLevel: 'silent',
  });
  const dir = mkdtempSync(join(tmpdir(), 'probe-refresh-session-'));
  const file = join(dir, 'authApi.mjs');
  writeFileSync(file, out.outputFiles[0].text);
  try {
    return (await import(pathToFileURL(file).href)) as Mod;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

async function run(steps: Step[], callers = 1): Promise<{ calls: number; results: Array<{ accessToken?: string } | null | 'threw'> }> {
  calls = 0;
  script = steps.slice();
  const out = await Promise.all(Array.from({ length: callers }, () => mod.refreshSession().catch(() => 'threw' as const)));
  return { calls, results: out };
}

const MISSING = { error: 'Missing refresh token', code: 'AUTH_MISSING_TOKEN' };
const REFUSED = { error: 'Invalid or expired refresh token', code: 'AUTH_INVALID_TOKEN' };
const OK = { accessToken: 'qa-access-token' };
let mod: Mod;

async function main() {
  mod = await load();
  console.log(`module: ${process.env.PROBE_AUTH_API || 'src/lib/authApi.ts'}`);

  let r = await run([{ status: 401, body: MISSING }]);
  mark('1 missing refresh token (signed-out page load): exactly one request, resolves null', r.calls === 1 && r.results[0] === null, `calls=${r.calls}`);

  r = await run([{ status: 401, body: REFUSED }, { status: 200, body: OK }]);
  mark('2 lost rotation race: one retry recovers the session', r.calls === 2 && (r.results[0] as { accessToken?: string })?.accessToken === OK.accessToken, `calls=${r.calls}`);

  r = await run([{ status: 401, body: REFUSED }, { status: 401, body: REFUSED }, { status: 200, body: OK }]);
  mark('3 invalid/revoked token: at most two requests, resolves null (no retry loop)', r.calls === 2 && r.results[0] === null, `calls=${r.calls}`);

  r = await run([{ status: 200, body: OK, delayMs: 50 }], 5);
  mark('4 five concurrent callers share one refresh request and the same token', r.calls === 1 && r.results.every((x) => (x as { accessToken?: string })?.accessToken === OK.accessToken), `calls=${r.calls}`);

  r = await run([{ status: 401, body: MISSING, delayMs: 20 }], 4);
  mark('5 signed-out page init with several concurrent callers: still one request', r.calls === 1 && r.results.every((x) => x === null), `calls=${r.calls}`);

  r = await run([{ status: 200, body: OK }]);
  mark('6 authenticated refresh: one request returns the access token', r.calls === 1 && (r.results[0] as { accessToken?: string })?.accessToken === OK.accessToken, `calls=${r.calls}`);

  r = await run([{ status: 401, body: { error: 'Missing refresh token' } }, { status: 401, body: { error: 'Missing refresh token' } }]);
  mark('7 server without codes (older API): unchanged single retry, resolves null', r.calls === 2 && r.results[0] === null, `calls=${r.calls}`);

  r = await run([{ status: 500, body: { error: 'boom' } }]);
  mark('8 server error: one request, error surfaces to the caller (unchanged)', r.calls === 1 && r.results[0] === 'threw', `calls=${r.calls}`);

  r = await run([{ status: 401, body: 'not-json' }, { status: 401, body: 'not-json' }]);
  mark('9 unparseable 401 body is not treated as missing: single retry only', r.calls === 2 && r.results[0] === null, `calls=${r.calls}`);

  const failed = results.filter((x) => !x.ok);
  console.log(`\n${results.length - failed.length} passed, ${failed.length} failed`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error('PROBE ERROR', e instanceof Error ? e.message : e);
  process.exit(1);
});
