# @pipeworx/mcp-musicbrainz

MCP server for music artist and release data via the [MusicBrainz API](https://musicbrainz.org/doc/MusicBrainz_API). Free, no authentication required.

## Tools

| Tool | Description |
|------|-------------|
| `search_artists` | Search for music artists by name |
| `get_artist` | Get full artist details including release list |
| `search_releases` | Search for albums and releases by title |
| `get_release` | Get release details including full track listing |

## Quickstart via Pipeworx Gateway

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "musicbrainz__search_artists",
      "arguments": { "query": "Radiohead", "limit": 5 }
    },
    "id": 1
  }'
```

## License

MIT
