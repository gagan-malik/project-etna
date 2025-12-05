/**
 * Confluence Integration Client
 * Handles Confluence API interactions for page indexing
 */

import axios, { AxiosInstance } from "axios";

export interface ConfluenceConfig {
  baseUrl: string; // e.g., "https://your-domain.atlassian.net"
  email: string;
  apiToken: string; // Confluence API token
}

export interface ConfluencePage {
  id: string;
  title: string;
  content: string;
  url: string;
  spaceKey: string;
  version: number;
}

export class ConfluenceClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(config: ConfluenceConfig) {
    this.baseUrl = config.baseUrl;
    const auth = Buffer.from(`${config.email}:${config.apiToken}`).toString(
      "base64"
    );

    this.client = axios.create({
      baseURL: `${config.baseUrl}/wiki/api/v2`,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * List all pages in a space
   */
  async listPages(spaceKey?: string, limit: number = 100): Promise<ConfluencePage[]> {
    try {
      const pages: ConfluencePage[] = [];
      let cursor: string | undefined;

      do {
        const params: any = {
          limit: Math.min(limit, 100),
        };

        if (spaceKey) {
          params.spaceId = spaceKey;
        }

        if (cursor) {
          params.cursor = cursor;
        }

        const response = await this.client.get("/pages", { params });
        const data = response.data;

        for (const page of data.results || []) {
          try {
            const content = await this.getPageContent(page.id);
            pages.push({
              id: page.id,
              title: page.title,
              content,
              url: `${this.baseUrl}/wiki${page._links.webui}`,
              spaceKey: page.spaceId || "",
              version: page.version?.number || 1,
            });
          } catch (error) {
            console.error(`Error fetching content for page ${page.id}:`, error);
          }
        }

        cursor = data._links?.next ? data.cursor : undefined;
      } while (cursor && pages.length < limit);

      return pages;
    } catch (error: any) {
      throw new Error(`Confluence API error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get page content by ID
   */
  async getPageContent(pageId: string): Promise<string> {
    try {
      const response = await this.client.get(`/pages/${pageId}`);
      const body = response.data.body;

      // Extract text from Confluence storage format
      if (body?.storage?.value) {
        // Simple text extraction - in production, you might want to parse HTML/storage format
        return body.storage.value.replace(/<[^>]*>/g, ""); // Remove HTML tags
      }

      return "";
    } catch (error: any) {
      throw new Error(`Confluence API error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Search pages
   */
  async searchPages(query: string, limit: number = 20): Promise<ConfluencePage[]> {
    try {
      const response = await this.client.get("/pages", {
        params: {
          title: query,
          limit,
        },
      });

      const pages: ConfluencePage[] = [];
      for (const page of response.data.results || []) {
        try {
          const content = await this.getPageContent(page.id);
          pages.push({
            id: page.id,
            title: page.title,
            content,
            url: `${this.baseUrl}/wiki${page._links.webui}`,
            spaceKey: page.spaceId || "",
            version: page.version?.number || 1,
          });
        } catch (error) {
          console.error(`Error fetching content for page ${page.id}:`, error);
        }
      }

      return pages;
    } catch (error: any) {
      throw new Error(`Confluence API error: ${error.response?.data?.message || error.message}`);
    }
  }
}

