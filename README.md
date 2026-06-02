# mcp-musicbrainz

MusicBrainz MCP — wraps MusicBrainz Web Service v2 (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_artists` | Search for music artists by name. Returns artist IDs, names, types, and countries. Use get_artist to fetch full discography and biographical details. |
| `search_releases` | Search for albums and releases by title or artist name. Returns release IDs, titles, artists, release dates, and formats. |

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

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
