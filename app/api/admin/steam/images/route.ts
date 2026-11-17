import { NextRequest, NextResponse } from "next/server";
import { getAdminAccess } from "@/src/lib/admin/acess";

export const runtime = "nodejs";

const STEAM_ASSETS_BASE =
  "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps";

type SteamScreenshot = {
  id: number;
  path_full: string;
};

type SteamAppDetails = {
  success: boolean;
  data?: {
    name?: string;
    screenshots?: SteamScreenshot[];
  };
};

type ImageCandidate = {
  url: string;
  label: string;
};

async function imageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
      redirect: "error",
    });

    if (!response.ok) return false;

    const contentType =
      response.headers.get("content-type") ?? "";

    return contentType.startsWith("image/");
  } catch {
    return false;
  }
}

async function availableImages(
  candidates: ImageCandidate[],
): Promise<ImageCandidate[]> {
  const results = await Promise.all(
    candidates.map(async (candidate) => ({
      ...candidate,
      available: await imageExists(candidate.url),
    })),
  );

  return results
    .filter((result) => result.available)
    .map(({ url, label }) => ({ url, label }));
}

async function getSteamScreenshots(
  appId: number,
): Promise<string[]> {
  try {
    const response = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`,
      {
        signal: AbortSignal.timeout(7000),
        cache: "no-store",
      },
    );

    if (!response.ok) return [];

    const result = (await response.json()) as Record<
      string,
      SteamAppDetails
    >;

    const screenshots =
      result[String(appId)]?.data?.screenshots ?? [];

    return screenshots
      .map((screenshot) => screenshot.path_full)
      .filter((url) => {
        try {
          const parsed = new URL(url);

          return (
            parsed.protocol === "https:" &&
            (parsed.hostname === "steamstatic.com" ||
              parsed.hostname.endsWith(".steamstatic.com"))
          );
        } catch {
          return false;
        }
      })
      .slice(0, 12);
  } catch {
    // A API de detalhes pode estar indisponível.
    // Não impedimos a consulta aos assets da CDN.
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await getAdminAccess();

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    const rawId = request.nextUrl.searchParams.get("appId");

    if (!rawId || !/^[1-9]\d{0,9}$/.test(rawId)) {
      return NextResponse.json(
        { error: "Invalid Steam AppID" },
        { status: 400 },
      );
    }

    const appId = Number(rawId);

    if (!Number.isSafeInteger(appId)) {
      return NextResponse.json(
        { error: "Invalid Steam AppID" },
        { status: 400 },
      );
    }

    const base = `${STEAM_ASSETS_BASE}/${appId}`;

    const [covers, heroes, screenshots] = await Promise.all([
      availableImages([
        {
          url: `${base}/library_600x900_2x.jpg`,
          label: "Cover 2x",
        },
        {
          url: `${base}/library_600x900.jpg`,
          label: "Cover",
        },
      ]),

      availableImages([
        {
          url: `${base}/library_hero_2x.jpg`,
          label: "Hero 2x",
        },
        {
          url: `${base}/library_hero.jpg`,
          label: "Hero",
        },
      ]),

      getSteamScreenshots(appId),
    ]);

    return NextResponse.json({
      appId,
      covers,
      heroes,
      screenshots,
    });
  } catch (error) {
    console.error("Steam image lookup failed:", error);

    return NextResponse.json(
      { error: "Could not fetch Steam images" },
      { status: 500 },
    );
  }
}