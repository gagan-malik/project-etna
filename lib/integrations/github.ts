/**
 * GitHub Integration Client
 * Handles GitHub API interactions for repository indexing
 */

import { Octokit } from "@octokit/rest";

export interface GitHubConfig {
  accessToken: string;
  owner: string;
  repo: string;
}

export interface GitHubFile {
  path: string;
  content: string;
  sha: string;
  size: number;
  type: string;
}

export class GitHubClient {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor(config: GitHubConfig) {
    this.octokit = new Octokit({
      auth: config.accessToken,
    });
    this.owner = config.owner;
    this.repo = config.repo;
  }

  /**
   * List all files in a repository
   */
  async listRepositoryFiles(
    path: string = "",
    recursive: boolean = true
  ): Promise<GitHubFile[]> {
    try {
      const files: GitHubFile[] = [];
      const { data } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: path || "",
      });

      if (Array.isArray(data)) {
        for (const item of data) {
          if (item.type === "file") {
            try {
              const fileData = await this.octokit.repos.getContent({
                owner: this.owner,
                repo: this.repo,
                path: item.path,
              });

              if ("content" in fileData.data && fileData.data.content) {
                const content = Buffer.from(
                  fileData.data.content,
                  "base64"
                ).toString("utf-8");

                files.push({
                  path: item.path,
                  content,
                  sha: item.sha,
                  size: item.size,
                  type: item.type,
                });
              }
            } catch (error) {
              console.error(`Error fetching file ${item.path}:`, error);
            }
          } else if (item.type === "dir" && recursive) {
            // Recursively get files from subdirectories
            const subFiles = await this.listRepositoryFiles(item.path, true);
            files.push(...subFiles);
          }
        }
      }

      return files;
    } catch (error: any) {
      throw new Error(`GitHub API error: ${error.message}`);
    }
  }

  /**
   * Get repository information
   */
  async getRepository() {
    try {
      const { data } = await this.octokit.repos.get({
        owner: this.owner,
        repo: this.repo,
      });
      return data;
    } catch (error: any) {
      throw new Error(`GitHub API error: ${error.message}`);
    }
  }

  /**
   * Search code in repository
   */
  async searchCode(query: string) {
    try {
      const { data } = await this.octokit.search.code({
        q: `repo:${this.owner}/${this.repo} ${query}`,
      });
      return data;
    } catch (error: any) {
      throw new Error(`GitHub API error: ${error.message}`);
    }
  }

  /**
   * Get file content by path
   */
  async getFileContent(path: string): Promise<string> {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
      });

      if ("content" in data && data.content) {
        return Buffer.from(data.content, "base64").toString("utf-8");
      }
      throw new Error("File content not found");
    } catch (error: any) {
      throw new Error(`GitHub API error: ${error.message}`);
    }
  }
}

