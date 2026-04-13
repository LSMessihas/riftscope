import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SERVER_TO_MATCH_ROUTING: Record<string, string> = {
  EUW: "europe",
  EUNE: "europe",
  TR: "europe",
  RU: "europe",
  NA: "americas",
  LAN: "americas",
  LAS: "americas",
  BR: "americas",
  KR: "asia",
  JP: "asia",
};

type MatchParticipant = {
  puuid: string;
  championName?: string;
  kills?: number;
  deaths?: number;
  assists?: number;
  win?: boolean;
};

type MatchResponse = {
  metadata?: {
    matchId?: string;
  };
  info?: {
    gameDuration?: number;
    queueId?: number;
    participants?: MatchParticipant[];
  };
};

type SimplifiedMatch = {
  matchId: string;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  gameDuration: number;
  queueId: number;
};

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.RIOT_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        matches: [],
        error: "RIOT_API_KEY is not configured on the server.",
      });
    }

    const { searchParams } = new URL(request.url);
    const puuid = searchParams.get("puuid")?.trim();
    const server = searchParams.get("server")?.trim().toUpperCase();

    if (!puuid || !server) {
      return NextResponse.json({
        matches: [],
        error: "Missing required query params `puuid` or `server`.",
      });
    }

    // match-v5 uses regional routing such as europe, americas, or asia.
    // It does not use platform routing like euw1 or na1.
    const regionalRouting = SERVER_TO_MATCH_ROUTING[server];

    if (!regionalRouting) {
      return NextResponse.json({
        matches: [],
        error: `Unsupported server \`${server}\` for match history.`,
      });
    }

    const riotHeaders = {
      "X-Riot-Token": process.env.RIOT_API_KEY as string,
    };

    const matchIdsUrl = new URL(
      `https://${regionalRouting}.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(
        puuid,
      )}/ids?count=5`,
    );

    console.log("[Riot API] matchIds URL used:", matchIdsUrl.toString());
    const matchIdsResponse = await fetch(matchIdsUrl.toString(), {
      headers: riotHeaders,
      cache: "no-store",
    });
    console.log(
      "[Riot API] matchIds response status:",
      matchIdsResponse.status,
    );

    if (!matchIdsResponse.ok) {
      return NextResponse.json({
        matches: [],
        error: "Failed to fetch match list",
      });
    }

    const matchIds = (await matchIdsResponse.json()) as string[];
    console.log("[Riot API] number of matchIds returned:", matchIds.length);

    const matches: SimplifiedMatch[] = [];

    for (const matchId of matchIds) {
      const matchUrl = new URL(
        `https://${regionalRouting}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(
          matchId,
        )}`,
      );

      const matchResponse = await fetch(matchUrl.toString(), {
        headers: riotHeaders,
        cache: "no-store",
      });
      console.log(
        `[Riot API] match fetch status for ${matchId}:`,
        matchResponse.status,
      );

      if (!matchResponse.ok) {
        continue;
      }

      const matchData = (await matchResponse.json()) as MatchResponse;
      const participant = matchData.info?.participants?.find(
        (entry) => entry.puuid === puuid,
      );

      if (!participant || !matchData.metadata?.matchId || !matchData.info) {
        continue;
      }

      matches.push({
        matchId: matchData.metadata.matchId,
        championName: participant.championName ?? "Unknown Champion",
        kills: participant.kills ?? 0,
        deaths: participant.deaths ?? 0,
        assists: participant.assists ?? 0,
        win: participant.win ?? false,
        gameDuration: matchData.info.gameDuration ?? 0,
        queueId: matchData.info.queueId ?? 0,
      });
    }

    return NextResponse.json({ matches });
  } catch (error) {
    console.log("[Riot API] match history warning:", error);

    return NextResponse.json({
      matches: [],
      error: "Failed to fetch match list",
    });
  }
}
