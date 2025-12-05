/**
 * Source Search Service
 * Handles searching across different data sources
 */

import axios from "axios";
import type { SourceType } from "@/components/chat/source-selector";

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: SourceType;
  metadata?: Record<string, any>;
}

export interface SourceSearchResponse {
  results: SearchResult[];
  total: number;
  source: SourceType;
}

/**
 * Web Search using DuckDuckGo Instant Answer API
 */
async function searchWeb(query: string): Promise<SourceSearchResponse> {
  try {
    // Using DuckDuckGo HTML API (no API key required)
    const response = await axios.get("https://html.duckduckgo.com/html/", {
      params: {
        q: query,
      },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    // Parse HTML results (simplified - in production, use a proper HTML parser)
    const results: SearchResult[] = [];
    const html = response.data;
    
    // Extract results from DuckDuckGo HTML (basic parsing)
    // Note: This is a simplified implementation. For production, use a proper HTML parser like cheerio
    const resultMatches = html.match(/<a class="result__a"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g) || [];
    
    resultMatches.slice(0, 5).forEach((match: string, index: number) => {
      const urlMatch = match.match(/href="([^"]*)"/);
      const titleMatch = match.match(/>([^<]*)</);
      
      if (urlMatch && titleMatch) {
        results.push({
          title: titleMatch[1],
          url: urlMatch[1],
          snippet: `Search result ${index + 1} for: ${query}`,
          source: "web",
        });
      }
    });

    // Fallback: If no results, use a simple web search API alternative
    if (results.length === 0) {
      // Try using SerpAPI or Google Custom Search if API keys are available
      const serpApiKey = process.env.SERP_API_KEY;
      if (serpApiKey) {
        try {
          const serpResponse = await axios.get("https://serpapi.com/search", {
            params: {
              engine: "google",
              q: query,
              api_key: serpApiKey,
              num: 5,
            },
          });

          if (serpResponse.data?.organic_results) {
            return {
              results: serpResponse.data.organic_results.map((result: any) => ({
                title: result.title,
                url: result.link,
                snippet: result.snippet || "",
                source: "web" as SourceType,
              })),
              total: serpResponse.data.organic_results.length,
              source: "web",
            };
          }
        } catch (serpError) {
          console.error("SerpAPI error:", serpError);
        }
      }
    }

    return {
      results: results.length > 0 ? results : [{
        title: `Web search: ${query}`,
        url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        snippet: `Search the web for: ${query}`,
        source: "web",
      }],
      total: results.length,
      source: "web",
    };
  } catch (error) {
    console.error("Web search error:", error);
    return {
      results: [{
        title: `Web search: ${query}`,
        url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        snippet: `Search the web for: ${query}`,
        source: "web",
      }],
      total: 1,
      source: "web",
    };
  }
}

/**
 * Academic Papers Search using Semantic Scholar API
 */
async function searchAcademic(query: string): Promise<SourceSearchResponse> {
  try {
    const response = await axios.get("https://api.semanticscholar.org/graph/v1/paper/search", {
      params: {
        query,
        limit: 5,
        fields: "title,url,abstract,authors,year",
      },
    });

    return {
      results: (response.data.data || []).map((paper: any) => ({
        title: paper.title || "Untitled Paper",
        url: paper.url || "#",
        snippet: paper.abstract || `Academic paper from ${paper.year || "unknown year"}`,
        source: "academic" as SourceType,
        metadata: {
          authors: paper.authors?.map((a: any) => a.name).join(", ") || "",
          year: paper.year,
        },
      })),
      total: response.data.total || 0,
      source: "academic",
    };
  } catch (error) {
    console.error("Academic search error:", error);
    return {
      results: [],
      total: 0,
      source: "academic",
    };
  }
}

/**
 * News Search using NewsAPI
 */
async function searchNews(query: string): Promise<SourceSearchResponse> {
  try {
    const newsApiKey = process.env.NEWS_API_KEY;
    if (!newsApiKey) {
      return {
        results: [{
          title: `News search: ${query}`,
          url: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
          snippet: `Search news for: ${query}. Add NEWS_API_KEY to enable full search.`,
          source: "news",
        }],
        total: 1,
        source: "news",
      };
    }

    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: query,
        apiKey: newsApiKey,
        pageSize: 5,
        sortBy: "relevancy",
      },
    });

    return {
      results: (response.data.articles || []).map((article: any) => ({
        title: article.title || "Untitled Article",
        url: article.url || "#",
        snippet: article.description || article.title || "",
        source: "news" as SourceType,
        metadata: {
          publishedAt: article.publishedAt,
          source: article.source?.name,
        },
      })),
      total: response.data.totalResults || 0,
      source: "news",
    };
  } catch (error) {
    console.error("News search error:", error);
    return {
      results: [{
        title: `News search: ${query}`,
        url: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
        snippet: `Search news for: ${query}`,
        source: "news",
      }],
      total: 1,
      source: "news",
    };
  }
}

/**
 * Finance/SEC Filings Search
 */
async function searchFinance(query: string): Promise<SourceSearchResponse> {
  try {
    // Using SEC EDGAR search API
    const response = await axios.get("https://www.sec.gov/cgi-bin/browse-edgar", {
      params: {
        action: "getcompany",
        company: query,
        type: "",
        dateb: "",
        owner: "exclude",
        start: 0,
        count: 5,
        output: "atom",
      },
      headers: {
        "User-Agent": "Project Etna (contact@example.com)",
        "Accept": "application/atom+xml",
      },
    });

    // Parse ATOM feed (simplified)
    const results: SearchResult[] = [];
    const xml = response.data;
    const entryMatches = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];

    entryMatches.forEach((entry: string) => {
      const titleMatch = entry.match(/<title[^>]*>([^<]*)<\/title>/);
      const linkMatch = entry.match(/<link[^>]*href="([^"]*)"/);
      const summaryMatch = entry.match(/<summary[^>]*>([^<]*)<\/summary>/);

      if (titleMatch) {
        results.push({
          title: titleMatch[1],
          url: linkMatch ? linkMatch[1] : "#",
          snippet: summaryMatch ? summaryMatch[1] : "SEC filing",
          source: "finance",
        });
      }
    });

    return {
      results: results.length > 0 ? results : [{
        title: `SEC filings search: ${query}`,
        url: `https://www.sec.gov/cgi-bin/browse-edgar?company=${encodeURIComponent(query)}`,
        snippet: `Search SEC filings for: ${query}`,
        source: "finance",
      }],
      total: results.length,
      source: "finance",
    };
  } catch (error) {
    console.error("Finance search error:", error);
    return {
      results: [{
        title: `SEC filings search: ${query}`,
        url: `https://www.sec.gov/cgi-bin/browse-edgar?company=${encodeURIComponent(query)}`,
        snippet: `Search SEC filings for: ${query}`,
        source: "finance",
      }],
      total: 1,
      source: "finance",
    };
  }
}

/**
 * Main search function that routes to appropriate source
 */
export async function searchSource(
  query: string,
  source: SourceType
): Promise<SourceSearchResponse> {
  switch (source) {
    case "web":
      return searchWeb(query);
    case "academic":
      return searchAcademic(query);
    case "news":
      return searchNews(query);
    case "finance":
      return searchFinance(query);
    default:
      return {
        results: [],
        total: 0,
        source,
      };
  }
}

/**
 * Search across multiple sources
 */
export async function searchMultipleSources(
  query: string,
  sources: SourceType[]
): Promise<SourceSearchResponse[]> {
  const searchPromises = sources.map((source) => searchSource(query, source));
  return Promise.all(searchPromises);
}

