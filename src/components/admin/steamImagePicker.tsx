"use client";

import { useState } from "react";

type ImageOption = {
  url: string;
  label: string;
};

type SteamImagesResponse = {
  appId: number;
  covers: ImageOption[];
  heroes: ImageOption[];
  screenshots: string[];
  error?: string;
};

interface Props {
  steamAppId: string;
  image: string;
  heroImage: string;
  gallery: string[];
  onChange: (value: {
    image: string;
    heroImage: string;
    gallery: string[];
  }) => void;
}

export default function SteamImagePicker({
  steamAppId,
  image,
  heroImage,
  gallery,
  onChange,
}: Props) {
  const [data, setData] = useState<SteamImagesResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchImages() {
    if (!/^[1-9]\d*$/.test(steamAppId.trim())) {
      setError("Enter a valid Steam AppID.");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch(
        `/api/admin/steam/images?appId=${encodeURIComponent(
          steamAppId.trim(),
        )}`,
      );

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error(
          `Unexpected server response (HTTP ${response.status})`,
        );
      }

      const result =
        (await response.json()) as SteamImagesResponse;

      if (!response.ok) {
        throw new Error(
          result.error ?? "Could not retrieve Steam images",
        );
      }

      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unexpected error",
      );
    } finally {
      setLoading(false);
    }
  }

  function selectCover(url: string) {
    onChange({ image: url, heroImage, gallery });
  }

  function selectHero(url: string) {
    onChange({ image, heroImage: url, gallery });
  }

  function toggleScreenshot(url: string) {
    const exists = gallery.includes(url);

    if (!exists && gallery.length >= 8) return;

    onChange({
      image,
      heroImage,
      gallery: exists
        ? gallery.filter((item) => item !== url)
        : [...gallery, url],
    });
  }

  const buttonClass =
    "rounded-lg border border-neon-pink/40 bg-neon-pink/10 px-3 py-2 text-xs font-semibold text-neon-white transition hover:bg-neon-pink/20";

  return (
    <div className="space-y-5 rounded-xl border border-white/10 bg-black p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-gabarito text-base font-semibold text-white">
            Steam Image Library
          </h3>

          <p className="mt-1 text-xs text-neon-gray">
            Find game artwork using the Steam AppID.
          </p>
        </div>

        <button
          type="button"
          disabled={loading || !steamAppId.trim()}
          onClick={fetchImages}
          className="rounded-xl bg-neon-gradient px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Fetching..." : "Fetch Steam Images"}
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      {data && (
        <div className="space-y-6">
          <div className="border-t border-white/10 pt-5">
            <h4 className="mb-3 text-sm font-semibold text-white">
              Cover Image
            </h4>

            {data.covers.length === 0 ? (
              <p className="text-sm text-neon-gray">
                No cover images found.
              </p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {data.covers.map((cover) => (
                  <div
                    key={cover.url}
                    className="w-32 space-y-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover.url}
                      alt={cover.label}
                      className="aspect-[2/3] w-full rounded-lg object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => selectCover(cover.url)}
                      className={buttonClass}
                    >
                      {image === cover.url
                        ? "Selected"
                        : `Use ${cover.label}`}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-white/10 pt-5">
            <h4 className="mb-3 text-sm font-semibold text-white">
              Hero Image
            </h4>

            {data.heroes.length === 0 ? (
              <p className="text-sm text-neon-gray">
                No hero images found.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {data.heroes.map((hero) => (
                  <div
                    key={hero.url}
                    className="space-y-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={hero.url}
                      alt={hero.label}
                      className="aspect-video w-full rounded-lg bg-zinc-900 object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => selectHero(hero.url)}
                      className={buttonClass}
                    >
                      {heroImage === hero.url
                        ? "Selected"
                        : `Use ${hero.label}`}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-white/10 pt-5">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">
                Screenshots
              </h4>

              <span className="text-xs text-neon-gray">
                {gallery.length}/8 selected
              </span>
            </div>

            {data.screenshots.length === 0 ? (
              <p className="text-sm text-neon-gray">
                No screenshots found. You can still add
                gallery URLs manually.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {data.screenshots.map((url) => (
                  <button
                    key={url}
                    type="button"
                    disabled={
                      gallery.length >= 8 &&
                      !gallery.includes(url)
                    }
                    onClick={() => toggleScreenshot(url)}
                    className={`overflow-hidden rounded-lg border-2 text-left transition disabled:opacity-40 ${
                      gallery.includes(url)
                        ? "border-neon-green"
                        : "border-transparent hover:border-neon-pink"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt="Game screenshot"
                      className="aspect-video w-full object-cover"
                    />

                    <span className="block bg-zinc-900 px-2 py-2 text-xs text-white">
                      {gallery.includes(url)
                        ? "Selected"
                        : "Add to gallery"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}