import { execFileSync } from "node:child_process";

function readGhToken(): string | null {
  try {
    const token = execFileSync("gh", ["auth", "token", "-h", "github.com"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    return token || null;
  } catch {
    return null;
  }
}

function readEnvToken(): string | null {
  return (
    process.env.GH_TOKEN?.trim() ||
    process.env.GITHUB_TOKEN?.trim() ||
    process.env.COPILOT_GITHUB_TOKEN?.trim() ||
    process.env.GITHUB_PAT?.trim() ||
    null
  );
}

function resolveGitHubToken(): string {
  const token = readGhToken() ?? readEnvToken();

  if (!token) {
    throw new Error(
      "Missing GitHub token. Run: gh auth login, or set GH_TOKEN / GITHUB_TOKEN / COPILOT_GITHUB_TOKEN"
    );
  }

  return token;
}

export function prepareCopilotAuthEnv(): void {
  const token = resolveGitHubToken();
  process.env.COPILOT_GITHUB_TOKEN = token;
  process.env.GH_TOKEN = token;
  process.env.GITHUB_TOKEN = token;
}
