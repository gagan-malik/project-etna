# Source Search Implementation

This document describes the source search functionality that allows users to search across different data sources.

## Supported Sources

### Built-in Sources
- **Web** - General web search (uses DuckDuckGo, with optional SerpAPI support)
- **Academic Research Papers** - Semantic Scholar API
- **News** - NewsAPI (optional, requires API key)
- **Finance** - SEC EDGAR filings search
- **Org files** - Organization files from your workspace
- **My files** - Personal uploaded files

### Third-party Integrations
- **GitHub** - Search GitHub repositories
- **Gmail with Calendar** - Search Gmail and Calendar
- **Google Drive** - Search Google Drive files
- **Slack** - Search Slack messages
- **Confluence** - Search Confluence pages
- **Microsoft Graph** - Search Microsoft 365

## Environment Variables

### Optional API Keys (for enhanced search)

```bash
# SerpAPI (for better web search results)
SERP_API_KEY=your_serpapi_key_here

# NewsAPI (for news search)
NEWS_API_KEY=your_newsapi_key_here
```

### Getting API Keys

1. **SerpAPI** (optional, for enhanced web search):
   - Sign up at https://serpapi.com/
   - Get your API key from the dashboard
   - Add to `.env.local` as `SERP_API_KEY`

2. **NewsAPI** (optional, for news search):
   - Sign up at https://newsapi.org/
   - Get your API key from the dashboard
   - Add to `.env.local` as `NEWS_API_KEY`

## How It Works

1. **User selects sources** in the chat interface using the "Set sources" button
2. **When sending a message**, the system:
   - Searches selected external sources (web, academic, news, finance)
   - Searches user files if "my_files" or "org_files" is selected
   - Fetches data from third-party integrations if enabled
   - Combines all results into context for the AI
3. **AI responds** with information from the selected sources

## Implementation Details

### Source Search Service
Located in `lib/sources/search.ts`, this service handles:
- Web search via DuckDuckGo (fallback to SerpAPI if key provided)
- Academic papers via Semantic Scholar API
- News via NewsAPI (if key provided)
- Finance/SEC filings via SEC EDGAR API

### API Integration
The `/api/messages/stream` endpoint:
- Accepts `sources` array in request body
- Searches external sources in parallel
- Filters document search based on source selection
- Includes all results in AI context

## Usage

1. Click "Set sources" button in the chat input area
2. Toggle sources on/off
3. Send your message
4. AI will search and use information from selected sources

## Future Enhancements

- [ ] Real-time integration data fetching
- [ ] Source-specific result highlighting
- [ ] Caching of search results
- [ ] Advanced filtering options
- [ ] Source-specific settings

