import { Octokit } from "@octokit/rest";

if (!process.env.GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN env var is not set");
}
if (!process.env.GITHUB_OWNER) {
  throw new Error("GITHUB_OWNER env var is not set");
}
if (!process.env.GITHUB_REPO) {
  throw new Error("GITHUB_REPO env var is not set");
}

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

/** Extract "owner" or "owner/repo" from a full GitHub URL if needed */
function extractPathSegment(raw: string, segmentFromEnd: number): string {
  const trimmed = raw.trim().replace(/\/$/, "");
  // If it looks like a URL, grab path segments
  try {
    const url = new URL(trimmed);
    const parts = url.pathname.replace(/^\//, "").split("/");
    return parts[parts.length - segmentFromEnd] ?? trimmed;
  } catch {
    // Not a URL — use as-is
    return trimmed;
  }
}

const _rawOwner = process.env.GITHUB_OWNER!;
const _rawRepo  = process.env.GITHUB_REPO!;

// GITHUB_OWNER may be "https://github.com/acme" → extract "acme"
const OWNER = extractPathSegment(_rawOwner, 1);
// GITHUB_REPO may be "https://github.com/acme/my-repo" → extract "my-repo"
const REPO  = _rawRepo.includes("/")
  ? extractPathSegment(_rawRepo, 1)   // last segment of a URL or "owner/repo"
  : _rawRepo.trim();

export interface GitHubFileResult {
  content: any;
  sha: string;
}

/**
 * Read a JSON file from the repo and return its parsed content + current SHA.
 */
export async function readJsonFile(path: string): Promise<GitHubFileResult> {
  const { data } = await octokit.repos.getContent({ owner: OWNER, repo: REPO, path });

  if (Array.isArray(data) || data.type !== "file") {
    throw new Error(`Expected a file at "${path}" but found a directory`);
  }

  const decoded = Buffer.from(data.content, "base64").toString("utf8");
  return { content: JSON.parse(decoded), sha: data.sha };
}

/**
 * Write a JSON value to the repo as a commit.
 * Pass sha="" to create a new file, or the current SHA to update.
 * Returns the new file SHA.
 */
export async function writeJsonFile(
  path: string,
  data: unknown,
  sha: string,
  message = `chore: update ${path} via dashboard`,
): Promise<string> {
  const encoded = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

  const params: any = { owner: OWNER, repo: REPO, path, message, content: encoded };
  if (sha) params.sha = sha;

  const { data: result } = await octokit.repos.createOrUpdateFileContents(params);
  return result.content?.sha ?? "";
}
