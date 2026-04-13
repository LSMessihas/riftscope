import { NextRequest, NextResponse } from "next/server";

const DEFAULT_ROUTING_REGION = "europe";

export async function GET(request: NextRequest) {
  // Read the secret on the server only so it is never exposed to client-side code.
  const apiKey = process.env.RIOT_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "RIOT_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim();
  const tag = searchParams.get("tag")?.trim();
  const region =
    searchParams.get("region")?.trim().toLowerCase() || DEFAULT_ROUTING_REGION;

  // The route requires both Riot ID parts because the Riot Account API looks up players by game name and tagline.
  if (!name || !tag) {
    return NextResponse.json(
      {
        error: "Missing required query params. Provide both `name` and `tag`.",
      },
      { status: 400 },
    );
  }

  // Riot's Account-V1 endpoint uses a regional routing host such as europe, americas, asia, or sea.
  const riotUrl = new URL(
    `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
      name,
    )}/${encodeURIComponent(tag)}`,
  );

  try {
    // The API key is attached in the request header from the server, which keeps it hidden from the browser.
    const response = await fetch(riotUrl.toString(), {
      headers: {
        "X-Riot-Token": apiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorBody = await response.text();

      return NextResponse.json(
        {
          error: "Failed to fetch account data from Riot API.",
          status: response.status,
          details: errorBody || "No additional error details were returned.",
        },
        { status: response.status },
      );
    }

    // Pass Riot's JSON payload through so the frontend can consume a clean server response later.
    const accountData = await response.json();

    return NextResponse.json(accountData);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected server error while contacting Riot API.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
