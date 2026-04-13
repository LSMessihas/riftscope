import { NextRequest, NextResponse } from "next/server";

const PLATFORM_TO_REGIONAL_ROUTING: Record<string, string> = {
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
  OCE: "americas",
};

const PLATFORM_TO_PLATFORM_HOST: Record<string, string> = {
  EUW: "euw1",
  EUNE: "eun1",
  TR: "tr1",
  RU: "ru",
  NA: "na1",
  LAN: "la1",
  LAS: "la2",
  BR: "br1",
  KR: "kr",
  JP: "jp1",
  OCE: "oc1",
};

type RiotRankedEntry = {
  queueType: string;
  tier?: string;
  rank?: string;
  leaguePoints?: number;
  wins?: number;
  losses?: number;
};

type RankedSummary = {
  tier: string;
  rank: string;
  lp: number;
  wins: number;
  losses: number;
};

type RankedPayload = {
  soloDuo: RankedSummary | null;
  flex: RankedSummary | null;
};

type EndpointCategory = "account-v1" | "summoner-v4" | "league-v4";

function buildRankedSummary(entry: RiotRankedEntry | undefined | null) {
  if (!entry) {
    return null;
  }

  return {
    tier: entry.tier ?? "UNRANKED",
    rank: entry.rank ?? "",
    lp: entry.leaguePoints ?? 0,
    wins: entry.wins ?? 0,
    losses: entry.losses ?? 0,
  } satisfies RankedSummary;
}

function buildDebugInfo(
  regionalRouting: string,
  platformRouting: string,
  endpointCategory: EndpointCategory,
) {
  return {
    regionalRouting,
    platformRouting,
    endpointCategory,
  };
}

function buildStepErrorResponse(args: {
  status: number;
  step: EndpointCategory;
  host: string;
  identifierUsed: string;
  message: string;
  details: string;
  regionalRouting: string;
  platformRouting: string;
}) {
  return NextResponse.json(
    {
      error: args.message,
      details: args.details,
      stepFailed: args.step,
      hostUsed: args.host,
      identifierUsed: args.identifierUsed,
      debug: buildDebugInfo(
        args.regionalRouting,
        args.platformRouting,
        args.step,
      ),
    },
    { status: args.status },
  );
}

function buildPartialProfileResponse(args: {
  accountData: {
    puuid: string;
    gameName: string;
    tagLine: string;
  };
  server: string;
  regionalRouting: string;
  platformRouting: string;
  summonerLevel: number;
  profileIconId: number;
  rankedMessage: string;
  debug: Record<string, unknown>;
}) {
  return NextResponse.json({
    ...args.accountData,
    server: args.server,
    regionalRouting: args.regionalRouting,
    platformRouting: args.platformRouting,
    summonerLevel: args.summonerLevel,
    profileIconId: args.profileIconId,
    ranked: null,
    rankedMessage: args.rankedMessage,
    partialProfile: true,
    debug: args.debug,
  });
}

export async function GET(request: NextRequest) {
  // Read the Riot API key only on the server so it never reaches client-side code.
  const apiKey = process.env.RIOT_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "RIOT_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const gameName = searchParams.get("gameName")?.trim();
  const tagLine = searchParams.get("tagLine")?.trim();
  const server = searchParams.get("server")?.trim().toUpperCase();

  // Riot ID is the player-facing identifier: `gameName#tagLine`.
  // Platform routing is the LoL shard, such as EUW or NA.
  // Regional routing is Riot's broader host grouping for account-v1, such as europe or americas.
  if (!gameName || !tagLine) {
    return NextResponse.json(
      {
        error: "Invalid Riot ID format. Provide both `gameName` and `tagLine`.",
      },
      { status: 400 },
    );
  }

  if (!server) {
    return NextResponse.json(
      { error: "Missing required query param `server`." },
      { status: 400 },
    );
  }

  const regionalRouting = PLATFORM_TO_REGIONAL_ROUTING[server];
  const platformRouting = PLATFORM_TO_PLATFORM_HOST[server];

  if (!regionalRouting || !platformRouting) {
    return NextResponse.json(
      {
        error: `Unsupported server \`${server}\`. Choose one of: ${Object.keys(
          PLATFORM_TO_PLATFORM_HOST,
        ).join(", ")}.`,
      },
      { status: 400 },
    );
  }

  // Regional routing is only for account-v1.
  // Platform routing is used for summoner-v4 and league-v4.
  // This split matters because Riot groups account lookups by broad regions, but gameplay data by platform shards.

  // account-v1 uses a regional host to resolve Riot ID into account data and PUUID.
  const accountUrl = new URL(
    `https://${regionalRouting}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
      gameName,
    )}/${encodeURIComponent(tagLine)}`,
  );
  const accountHost = `${regionalRouting}.api.riotgames.com`;

  try {
    const riotHeaders = {
      "X-Riot-Token": process.env.RIOT_API_KEY as string,
    };

    console.log("[Riot API] account URL used:", accountUrl.toString());
    const accountResponse = await fetch(accountUrl.toString(), {
      headers: riotHeaders,
      cache: "no-store",
    });
    console.log("[Riot API] account response status:", accountResponse.status);

    if (!accountResponse.ok) {
      if (accountResponse.status === 404) {
        return buildStepErrorResponse({
          status: 404,
          step: "account-v1",
          host: accountHost,
          identifierUsed: `${gameName}#${tagLine}`,
          message: "Player not found.",
          details: `No Riot account was found for ${gameName}#${tagLine}.`,
          regionalRouting,
          platformRouting,
        });
      }

      if (accountResponse.status === 403) {
        return buildStepErrorResponse({
          status: 403,
          step: "account-v1",
          host: accountHost,
          identifierUsed: `${gameName}#${tagLine}`,
          message: "Access denied while calling Riot account-v1.",
          details:
            "The Riot API key was rejected during the account lookup stage.",
          regionalRouting,
          platformRouting,
        });
      }

      const errorBody = await accountResponse.text();

      return buildStepErrorResponse({
        status: accountResponse.status,
        step: "account-v1",
        host: accountHost,
        identifierUsed: `${gameName}#${tagLine}`,
        message: "Failed to fetch account data from Riot API.",
        details: errorBody || "No additional error details were returned.",
        regionalRouting,
        platformRouting,
      });
    }

    const accountData = (await accountResponse.json()) as {
      puuid: string;
      gameName: string;
      tagLine: string;
    };

    // summoner-v4 uses the platform host and lets us turn PUUID into summoner profile data.
    const summonerUrl = new URL(
      `https://${platformRouting}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(
        accountData.puuid,
      )}`,
    );
    const summonerHost = `${platformRouting}.api.riotgames.com`;

    console.log("[Riot API] summoner URL used:", summonerUrl.toString());
    const summonerResponse = await fetch(summonerUrl.toString(), {
      headers: riotHeaders,
      cache: "no-store",
    });
    console.log("[Riot API] summoner response status:", summonerResponse.status);

    if (!summonerResponse.ok) {
      if (summonerResponse.status === 403) {
        return buildStepErrorResponse({
          status: 403,
          step: "summoner-v4",
          host: summonerHost,
          identifierUsed: accountData.puuid,
          message: "Access denied while calling Riot summoner-v4.",
          details:
            "The Riot API key was rejected during the summoner lookup stage.",
          regionalRouting,
          platformRouting,
        });
      }

      const errorBody = await summonerResponse.text();

      return buildStepErrorResponse({
        status: summonerResponse.status,
        step: "summoner-v4",
        host: summonerHost,
        identifierUsed: accountData.puuid,
        message: "Failed to fetch summoner data from Riot API.",
        details: errorBody || "No additional error details were returned.",
        regionalRouting,
        platformRouting,
      });
    }

    const summonerData = (await summonerResponse.json()) as {
      id?: string;
      summonerLevel?: number;
      profileIconId?: number;
    };

    console.log("[Riot API] summoner parsed object:", summonerData);

    // Account and summoner lookups are required.
    // Ranked lookup is optional for now, so the API can still return partial profile data when ranked data is unavailable.
    if (!summonerData.id) {
      console.log("[Riot API] ranked warning:", {
        stepFailed: "league-v4",
        hostUsed: `${platformRouting}.api.riotgames.com`,
        identifierUsed: "missing-summonerId",
        details:
          "Summoner lookup succeeded, but the encrypted summoner id was missing.",
      });

      return buildPartialProfileResponse({
        accountData,
        server,
        regionalRouting,
        platformRouting,
        summonerLevel: summonerData.summonerLevel ?? 0,
        profileIconId: summonerData.profileIconId ?? 29,
        rankedMessage: "Ranked data is currently unavailable",
        debug: {
          account: buildDebugInfo(regionalRouting, platformRouting, "account-v1"),
          summoner: buildDebugInfo(
            regionalRouting,
            platformRouting,
            "summoner-v4",
          ),
          league: buildDebugInfo(regionalRouting, platformRouting, "league-v4"),
          hosts: {
            account: accountHost,
            summoner: summonerHost,
            league: `${platformRouting}.api.riotgames.com`,
          },
          leagueLookupIdentifier: "missing-summonerId",
        },
      });
    }

    // Ranked data is optional for now.
    // We still return account and summoner details even if league-v4 fails, so the profile page can render partial success.
    //
    // league-v4 requires the encrypted summoner id from the summoner-v4 response field `id`.
    // It must not use the PUUID or any other identifier for the ranked lookup.
    const leagueUrl = new URL(
      `https://${platformRouting}.api.riotgames.com/lol/league/v4/entries/by-summoner/${encodeURIComponent(
        summonerData.id,
      )}`,
    );
    const leagueHost = `${platformRouting}.api.riotgames.com`;

    console.log("[Riot API] league URL used:", leagueUrl.toString());
    console.log(
      "[Riot API] league lookup identifier type:",
      "summonerId",
      summonerData.id,
    );
    let ranked: RankedPayload | null = null;
    let rankedMessage: string | null = null;

    const leagueResponse = await fetch(leagueUrl.toString(), {
      headers: riotHeaders,
      cache: "no-store",
    });
    console.log("[Riot API] league response status:", leagueResponse.status);

    if (!leagueResponse.ok) {
      const errorBody = await leagueResponse.text();

      if (leagueResponse.status === 403) {
        rankedMessage =
          "Ranked data is currently unavailable because the Riot API rejected the league lookup.";
      } else {
        rankedMessage =
          "Ranked data is currently unavailable. The profile loaded without ranked details.";
      }

      console.log("[Riot API] ranked warning:", {
        stepFailed: "league-v4",
        hostUsed: leagueHost,
        identifierUsed: `summonerId:${summonerData.id}`,
        status: leagueResponse.status,
        details: errorBody || "No additional error details were returned.",
      });

      return buildPartialProfileResponse({
        accountData,
        server,
        regionalRouting,
        platformRouting,
        summonerLevel: summonerData.summonerLevel ?? 0,
        profileIconId: summonerData.profileIconId ?? 29,
        rankedMessage: rankedMessage ?? "Ranked data is currently unavailable",
        debug: {
          account: buildDebugInfo(regionalRouting, platformRouting, "account-v1"),
          summoner: buildDebugInfo(
            regionalRouting,
            platformRouting,
            "summoner-v4",
          ),
          league: buildDebugInfo(regionalRouting, platformRouting, "league-v4"),
          hosts: {
            account: accountHost,
            summoner: summonerHost,
            league: leagueHost,
          },
          leagueLookupIdentifier: `summonerId:${summonerData.id}`,
        },
      });
    } else {
      const rankedEntries = (await leagueResponse.json()) as RiotRankedEntry[];
      const soloDuoEntry = rankedEntries.find(
        (entry) => entry.queueType === "RANKED_SOLO_5x5",
      );
      const flexEntry = rankedEntries.find(
        (entry) => entry.queueType === "RANKED_FLEX_SR",
      );

      ranked = {
        soloDuo: buildRankedSummary(soloDuoEntry),
        flex: buildRankedSummary(flexEntry),
      };

      if (rankedEntries.length === 0) {
        ranked = null;
        rankedMessage = "Ranked data is currently unavailable.";
      }
    }

    return NextResponse.json({
      ...accountData,
      server,
      regionalRouting,
      platformRouting,
      summonerLevel: summonerData.summonerLevel ?? 0,
      profileIconId: summonerData.profileIconId ?? 29,
      ranked,
      rankedMessage,
      partialProfile: ranked === null,
      debug: {
        account: buildDebugInfo(regionalRouting, platformRouting, "account-v1"),
        summoner: buildDebugInfo(
          regionalRouting,
          platformRouting,
          "summoner-v4",
        ),
        league: buildDebugInfo(regionalRouting, platformRouting, "league-v4"),
        hosts: {
          account: accountHost,
          summoner: summonerHost,
          league: leagueHost,
        },
        leagueLookupIdentifier: `summonerId:${summonerData.id}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected server error while contacting Riot API.",
        details: error instanceof Error ? error.message : "Unknown error",
        debug: {
          regionalRouting,
          platformRouting,
          endpointCategory: "account-v1",
        },
      },
      { status: 500 },
    );
  }
}
