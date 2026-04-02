/**
 * MusicBrainz MCP — wraps MusicBrainz Web Service v2 (free, no auth)
 *
 * Tools:
 * - search_artists: Search for artists by name
 * - get_artist: Get full artist details including releases
 * - search_releases: Search for albums/releases
 * - get_release: Get release details including track listing
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://musicbrainz.org/ws/2';

const HEADERS = {
  'User-Agent': 'pipeworx-mcp/0.1.0 (https://pipeworx.io)',
  'Accept': 'application/json',
};

type RawArtistSearchResult = {
  id: string;
  name: string;
  type?: string;
  country?: string;
  disambiguation?: string;
  score?: number;
};

type RawArtistSearchResponse = {
  artists: RawArtistSearchResult[];
  count: number;
  offset: number;
};

type RawLifeSpan = {
  begin?: string | null;
  end?: string | null;
  ended?: boolean;
};

type RawReleaseSummary = {
  id: string;
  title: string;
  date?: string;
  status?: string;
};

type RawArtistDetail = {
  id: string;
  name: string;
  type?: string;
  country?: string;
  'life-span'?: RawLifeSpan;
  releases?: RawReleaseSummary[];
};

type RawArtistCredit = {
  name?: string;
  artist?: { id: string; name: string };
};

type RawReleaseSearchResult = {
  id: string;
  title: string;
  date?: string;
  status?: string;
  'artist-credit'?: RawArtistCredit[];
  score?: number;
};

type RawReleaseSearchResponse = {
  releases: RawReleaseSearchResult[];
  count: number;
  offset: number;
};

type RawTrack = {
  id: string;
  title: string;
  number: string;
  position: number;
  length?: number | null;
};

type RawMedia = {
  tracks?: RawTrack[];
};

type RawReleaseDetail = {
  id: string;
  title: string;
  date?: string;
  status?: string;
  'artist-credit'?: RawArtistCredit[];
  media?: RawMedia[];
};

const tools: McpToolExport['tools'] = [
  {
    name: 'search_artists',
    description: 'Search for music artists by name using the MusicBrainz database.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Artist name or search query.',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return. Defaults to 10.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_artist',
    description:
      'Get detailed information about an artist including their release list. Use the MusicBrainz ID from search_artists.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'MusicBrainz artist ID (UUID).',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'search_releases',
    description: 'Search for albums and releases by title or query.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Release title or search query.',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return. Defaults to 10.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_release',
    description:
      'Get detailed information about a release including its full track listing. Use the MusicBrainz ID from search_releases.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'MusicBrainz release ID (UUID).',
        },
      },
      required: ['id'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_artists':
      return searchArtists(
        args.query as string,
        (args.limit as number | undefined) ?? 10,
      );
    case 'get_artist':
      return getArtist(args.id as string);
    case 'search_releases':
      return searchReleases(
        args.query as string,
        (args.limit as number | undefined) ?? 10,
      );
    case 'get_release':
      return getRelease(args.id as string);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function searchArtists(query: string, limit: number) {
  const params = new URLSearchParams({
    query: query,
    limit: String(limit),
    fmt: 'json',
  });

  const res = await fetch(`${BASE_URL}/artist?${params.toString()}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`MusicBrainz error: ${res.status}`);

  const data = (await res.json()) as RawArtistSearchResponse;

  return {
    total: data.count,
    artists: data.artists.map((a) => ({
      id: a.id,
      name: a.name,
      type: a.type ?? null,
      country: a.country ?? null,
      disambiguation: a.disambiguation ?? null,
      score: a.score ?? null,
    })),
  };
}

async function getArtist(id: string) {
  const res = await fetch(`${BASE_URL}/artist/${encodeURIComponent(id)}?inc=releases&fmt=json`, {
    headers: HEADERS,
  });
  if (!res.ok) throw new Error(`MusicBrainz error: ${res.status}`);

  const data = (await res.json()) as RawArtistDetail;
  const lifeSpan = data['life-span'];

  return {
    id: data.id,
    name: data.name,
    type: data.type ?? null,
    country: data.country ?? null,
    life_span: lifeSpan
      ? {
          begin: lifeSpan.begin ?? null,
          end: lifeSpan.end ?? null,
          ended: lifeSpan.ended ?? false,
        }
      : null,
    releases: (data.releases ?? []).map((r) => ({
      id: r.id,
      title: r.title,
      date: r.date ?? null,
      status: r.status ?? null,
    })),
  };
}

async function searchReleases(query: string, limit: number) {
  const params = new URLSearchParams({
    query: query,
    limit: String(limit),
    fmt: 'json',
  });

  const res = await fetch(`${BASE_URL}/release?${params.toString()}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`MusicBrainz error: ${res.status}`);

  const data = (await res.json()) as RawReleaseSearchResponse;

  return {
    total: data.count,
    releases: data.releases.map((r) => ({
      id: r.id,
      title: r.title,
      date: r.date ?? null,
      status: r.status ?? null,
      artist_credit: (r['artist-credit'] ?? []).map((ac) => ({
        name: ac.name ?? ac.artist?.name ?? null,
        artist_id: ac.artist?.id ?? null,
      })),
      score: r.score ?? null,
    })),
  };
}

async function getRelease(id: string) {
  const res = await fetch(
    `${BASE_URL}/release/${encodeURIComponent(id)}?inc=recordings&fmt=json`,
    { headers: HEADERS },
  );
  if (!res.ok) throw new Error(`MusicBrainz error: ${res.status}`);

  const data = (await res.json()) as RawReleaseDetail;

  const tracks = (data.media ?? []).flatMap((m) =>
    (m.tracks ?? []).map((t) => ({
      position: t.position,
      number: t.number,
      title: t.title,
      length_ms: t.length ?? null,
    })),
  );

  return {
    id: data.id,
    title: data.title,
    date: data.date ?? null,
    status: data.status ?? null,
    artist_credit: (data['artist-credit'] ?? []).map((ac) => ({
      name: ac.name ?? ac.artist?.name ?? null,
      artist_id: ac.artist?.id ?? null,
    })),
    tracks,
  };
}

export default { tools, callTool } satisfies McpToolExport;
