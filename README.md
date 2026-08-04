# mcp-musicbrainz

MusicBrainz MCP — wraps MusicBrainz Web Service v2 (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_artists` | Search for music artists by name. Returns artist IDs, names, types, and countries. Use get_artist to fetch full discography and biographical details. |
| `get_artist` | Get artist details including biography, country, founding date, and complete release list. Requires artist ID from search_artists. |
| `search_releases` | Search for albums and releases by title or artist name. Returns release IDs, titles, artists, release dates, and formats. |
| `get_release` | Get release details: full track listing, credits, media formats, and metadata. Requires release ID from search_releases. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "musicbrainz": {
      "url": "https://gateway.pipeworx.io/musicbrainz/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Musicbrainz data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
