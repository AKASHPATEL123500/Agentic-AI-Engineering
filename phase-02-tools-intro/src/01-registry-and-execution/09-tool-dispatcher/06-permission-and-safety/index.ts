/**
 * 15 — Working Directory and Runtime Context
 *
 * File tools ke liye working directory critical hai:
 *
 *   User: "read file notes.txt"
 *   → Kahan se? /home/akash/project/ ya /tmp/ ?
 *
 * Runtime context mein:
 *   - workingDir: where relative paths resolve
 *   - sandboxDir: where tool is allowed to write
 *   - env vars
 *   - process info
 *   - runtime limits (memory, timeout)
 */

import path from "path";
import os from "os";

// ─── Working Directory Manager ────────────────────────────────────────────────

export class WorkingDirectoryManager {
  private _current: string;
  private readonly _root: string; // cannot go above this
  private readonly _sandbox: string; // write operations only here

  constructor(
    opts: {
      initial?: string;
      root?: string;
      sandbox?: string;
    } = {},
  ) {
    this._root = opts.root ?? os.homedir();
    this._sandbox = opts.sandbox ?? path.join(os.tmpdir(), "agent_sandbox");
    this._current = opts.initial ?? this._root;
  }

  get current(): string {
    return this._current;
  }
  get root(): string {
    return this._root;
  }
  get sandbox(): string {
    return this._sandbox;
  }

  /** Change working directory (safe — no traversal above root) */
  chdir(newDir: string): { success: boolean; cwd: string; error?: string } {
    const resolved = path.resolve(this._current, newDir);

    // Security: must stay within root
    if (!resolved.startsWith(this._root)) {
      return {
        success: false,
        cwd: this._current,
        error: `Cannot navigate above root: ${this._root}`,
      };
    }

    this._current = resolved;
    return { success: true, cwd: this._current };
  }

  /** Resolve a path relative to current working dir */
  resolve(relativePath: string): string {
    return path.resolve(this._current, relativePath);
  }

  /** Check if path is within sandbox */
  isInSandbox(filePath: string): boolean {
    const resolved = path.resolve(this._current, filePath);
    return resolved.startsWith(this._sandbox);
  }

  /** Check if path is within root (read-allowed) */
  isInRoot(filePath: string): boolean {
    const resolved = path.resolve(this._current, filePath);
    return resolved.startsWith(this._root);
  }

  /** Safe path for read operations */
  resolveRead(filePath: string): {
    safe: boolean;
    resolved: string;
    error?: string;
  } {
    const resolved = path.resolve(this._current, filePath);

    // Check for traversal
    if (filePath.includes("..")) {
      // Re-check after resolution
      if (!resolved.startsWith(this._root)) {
        return {
          safe: false,
          resolved,
          error: `Path traversal detected: "${filePath}" escapes root`,
        };
      }
    }

    return { safe: true, resolved };
  }

  /** Safe path for write operations (must be in sandbox) */
  resolveWrite(filePath: string): {
    safe: boolean;
    resolved: string;
    error?: string;
  } {
    const resolved = path.resolve(this._sandbox, filePath);

    if (!resolved.startsWith(this._sandbox)) {
      return {
        safe: false,
        resolved,
        error: `Write operations must be within sandbox: ${this._sandbox}`,
      };
    }

    return { safe: true, resolved };
  }

  info() {
    return {
      current: this._current,
      root: this._root,
      sandbox: this._sandbox,
      relative: path.relative(this._root, this._current),
    };
  }
}

// ─── Runtime Context ──────────────────────────────────────────────────────────

export interface RuntimeLimits {
  maxExecutionMs: number; // tool execution timeout
  maxMemoryMB: number; // memory limit per tool
  maxOutputBytes: number; // max result size
}

export interface RuntimeContext {
  platform: string;
  nodeVersion: string;
  pid: number;
  hostname: string;
  timezone: string;
  limits: RuntimeLimits;
  workingDir: WorkingDirectoryManager;
  startedAt: number;
}

export class RuntimeContextBuilder {
  static build(
    opts: {
      workingDir?: string;
      sandboxDir?: string;
      limits?: Partial<RuntimeLimits>;
    } = {},
  ): RuntimeContext {
    const wdm = new WorkingDirectoryManager({
      initial: opts.workingDir,
      sandbox: opts.sandboxDir,
    });

    return {
      platform: process.platform,
      nodeVersion: process.version,
      pid: process.pid,
      hostname: os.hostname(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      limits: {
        maxExecutionMs: opts.limits?.maxExecutionMs ?? 30_000,
        maxMemoryMB: opts.limits?.maxMemoryMB ?? 256,
        maxOutputBytes: opts.limits?.maxOutputBytes ?? 1_000_000,
      },
      workingDir: wdm,
      startedAt: Date.now(),
    };
  }
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

console.log("📁 Working Directory and Runtime Context — Demo\n");
console.log("=".repeat(55));

// Working directory
console.log("\n📂 Working Directory Manager:");

const wdm = new WorkingDirectoryManager({
  initial: os.homedir(),
  root: os.homedir(),
  sandbox: path.join(os.tmpdir(), "agent_sandbox"),
});

console.log("Initial state:", wdm.info());

// Navigate
console.log("\n📌 Navigation:");
const cd1 = wdm.chdir("projects/my-agent");
console.log(
  `  chdir('projects/my-agent'): ${cd1.success ? "✅" : "❌"} → ${cd1.cwd}`,
);

// Path resolution
console.log("\n🔍 Path Resolution:");
const read1 = wdm.resolveRead("config.json");
console.log(
  `  resolveRead('config.json'): safe=${read1.safe}, path=${read1.resolved}`,
);

const read2 = wdm.resolveRead("../../etc/passwd");
console.log(
  `  resolveRead('../../etc/passwd'): safe=${read2.safe}${read2.error ? ", error=" + read2.error : ""}`,
);

const write1 = wdm.resolveWrite("output.txt");
console.log(
  `  resolveWrite('output.txt'): safe=${write1.safe}, path=${write1.resolved}`,
);

const write2 = wdm.resolveWrite("../secret.txt");
console.log(
  `  resolveWrite('../secret.txt'): safe=${write2.safe}${write2.error ? ", error=" + write2.error : ""}`,
);

// Runtime context
console.log("\n⚙️  Runtime Context:");
const runtime = RuntimeContextBuilder.build({
  limits: { maxExecutionMs: 10_000, maxMemoryMB: 128 },
});

console.log(`  Platform:    ${runtime.platform}`);
console.log(`  Node:        ${runtime.nodeVersion}`);
console.log(`  PID:         ${runtime.pid}`);
console.log(`  Hostname:    ${runtime.hostname}`);
console.log(`  Timezone:    ${runtime.timezone}`);
console.log(`  Limits:`);
console.log(`    Timeout:   ${runtime.limits.maxExecutionMs}ms`);
console.log(`    Memory:    ${runtime.limits.maxMemoryMB}MB`);
console.log(`    Output:    ${runtime.limits.maxOutputBytes} bytes`);

console.log("\n" + "=".repeat(55));
