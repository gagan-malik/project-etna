/**
 * Microsoft Graph Integration Client
 * Handles Microsoft 365 API interactions for OneDrive/SharePoint document indexing
 */

import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";

export interface MicrosoftConfig {
  accessToken: string;
}

export interface MicrosoftFile {
  id: string;
  name: string;
  content: string;
  webUrl: string;
  size: number;
  mimeType: string;
}

export class MicrosoftGraphClient {
  private client: any;

  constructor(config: MicrosoftConfig) {
    this.client = Client.init({
      authProvider: (done) => {
        done(null, config.accessToken);
      },
    });
  }

  /**
   * List files from OneDrive
   */
  async listOneDriveFiles(folderPath: string = "/"): Promise<MicrosoftFile[]> {
    try {
      const files: MicrosoftFile[] = [];
      let requestUrl = folderPath === "/" 
        ? "/me/drive/root/children"
        : `/me/drive/root:${folderPath}:/children`;

      let response = await this.client.api(requestUrl).get();

      while (response) {
        for (const item of response.value) {
          if (item.file) {
            try {
              const content = await this.getFileContent(item.id);
              files.push({
                id: item.id,
                name: item.name,
                content,
                webUrl: item.webUrl,
                size: item.size,
                mimeType: item.file.mimeType,
              });
            } catch (error) {
              console.error(`Error fetching content for file ${item.name}:`, error);
            }
          } else if (item.folder) {
            // Recursively get files from subfolders
            const subFiles = await this.listOneDriveFiles(
              folderPath === "/" ? `/${item.name}` : `${folderPath}/${item.name}`
            );
            files.push(...subFiles);
          }
        }

        if (response["@odata.nextLink"]) {
          response = await this.client.api(response["@odata.nextLink"]).get();
        } else {
          break;
        }
      }

      return files;
    } catch (error: any) {
      throw new Error(`Microsoft Graph API error: ${error.message}`);
    }
  }

  /**
   * Get file content by ID
   */
  async getFileContent(fileId: string): Promise<string> {
    try {
      const response = await this.client
        .api(`/me/drive/items/${fileId}/content`)
        .get();

      // Handle different content types
      if (typeof response === "string") {
        return response;
      } else if (response instanceof ArrayBuffer) {
        return Buffer.from(response).toString("utf-8");
      } else {
        return JSON.stringify(response);
      }
    } catch (error: any) {
      throw new Error(`Microsoft Graph API error: ${error.message}`);
    }
  }

  /**
   * Search files in OneDrive
   */
  async searchFiles(query: string): Promise<MicrosoftFile[]> {
    try {
      const response = await this.client
        .api(`/me/drive/root/search(q='${encodeURIComponent(query)}')`)
        .get();

      const files: MicrosoftFile[] = [];
      for (const item of response.value || []) {
        if (item.file) {
          try {
            const content = await this.getFileContent(item.id);
            files.push({
              id: item.id,
              name: item.name,
              content,
              webUrl: item.webUrl,
              size: item.size,
              mimeType: item.file.mimeType,
            });
          } catch (error) {
            console.error(`Error fetching content for file ${item.name}:`, error);
          }
        }
      }

      return files;
    } catch (error: any) {
      throw new Error(`Microsoft Graph API error: ${error.message}`);
    }
  }

  /**
   * List SharePoint sites
   */
  async listSharePointSites() {
    try {
      const response = await this.client.api("/sites").get();
      return response.value || [];
    } catch (error: any) {
      throw new Error(`Microsoft Graph API error: ${error.message}`);
    }
  }
}

