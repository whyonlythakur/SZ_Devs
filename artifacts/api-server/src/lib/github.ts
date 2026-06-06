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

const OWNER = process.env.GITHUB_OWNER;
const REPO  = process.env.GITHUB_REPO;

export interface GitHubFileResult {
  content: any;
  sha: string;
}

/**
 * Read a JSON file from the repo and return its parsed content + current SHA.
 * The SHA is required by the GitHub API when you want to update the file.
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
 * Write a JSON value back to the repo as a commit.
 * `sha` must be the SHA of the current file (obtained from readJsonFile).
 */
export async function writeJsonFile(
  path: string,
  data: unknown,
  sha: string,
  message = `chore: update ${path} via dashboard`,
): Promise<void> {
  const encoded = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path,
    message,
    content: encoded,
    sha,
  });
}
